import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { useProduct, useUpdateProduct, useCreateProduct } from '../../hooks/useProducts';
import { useCategories, useSubCategories } from '../../hooks/useCategories';
import { useVendors } from '../../hooks/useVendors';
import { useSizes } from '../../hooks/useSizes';
import { Package, Plus, Trash2, Save, Loader2, ArrowLeft, UploadCloud, Ruler, Image as ImageIcon } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = !!id; 

  const { data: productData, isPending: isLoadingProduct } = useProduct(id);
  const { data: categories } = useCategories();
  const { data: subCategories } = useSubCategories();
  const { data: vendors } = useVendors();
  const { data: sizes } = useSizes();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const [formData, setFormData] = useState({
    productName: '', vendor: '', category: '', subCategory: '', fabric: '', price: '',
    inventory: [{ size: '', quantity: 0 }] 
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (isEditMode && productData?.data) {
      const p = productData.data;
      setFormData({
        productName: p.productName || '',
        vendor: p.vendor?._id || p.vendor || '',
        category: p.category?._id || p.category || '',
        subCategory: p.subCategory?._id || p.subCategory || '',
        fabric: p.fabric || '',
        price: p.price?.toString() || '', 
        inventory: p.inventory ? p.inventory.map(item => ({ 
          size: item.size?._id || item.size || '', 
          quantity: item.quantity || 0 
        })) : [{ size: '', quantity: 0 }]
      });
      if (p.image) setImagePreview(p.image);
    }
  }, [isEditMode, productData]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const options = { maxSizeMB: 0.7, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedBlob = await imageCompression(file, options);
      const compressedFile = new File([compressedBlob], file.name, { type: file.type });
      setSelectedFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error("Compression Error:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('productName', formData.productName);
    data.append('vendor', formData.vendor);
    data.append('category', formData.category);
    if (formData.subCategory) data.append('subCategory', formData.subCategory);
    data.append('fabric', formData.fabric);
    data.append('price', formData.price);
    
    const cleanedInventory = formData.inventory.map(item => ({
      size: item.size,
      quantity: Number(item.quantity)
    }));
    data.append('inventory', JSON.stringify(cleanedInventory));
    
    if (selectedFile) data.append('image', selectedFile);

    const mutationOptions = {
      onSuccess: () => navigate('/products'),
      onError: (err) => alert(err.response?.data?.message || "Failed to save product")
    };

    if (isEditMode) {
      updateMutation.mutate({ id, formDataPayload: data }, mutationOptions);
    } else {
      createMutation.mutate(data, mutationOptions);
    }
  };

  if (isEditMode && isLoadingProduct) return (
    <div className="flex justify-center p-40"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/products')} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all">
          <ArrowLeft/>
        </button>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter transition-colors">
          {isEditMode ? 'Edit Product Access' : 'Add New Inventory'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Core Specs */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Package size={14}/> Core Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <input 
                  type="text" required value={formData.productName} 
                  onChange={e => setFormData({...formData, productName: e.target.value})}
                  className="w-full text-xl font-bold bg-transparent text-gray-900 dark:text-white border-b-2 border-gray-100 dark:border-slate-700 py-3 focus:border-blue-600 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600" 
                  placeholder="Product Display Name" 
                />
              </div>
              <input 
                type="number" required placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white py-3.5 px-4 font-black focus:ring-2 focus:ring-blue-500 border border-transparent dark:border-slate-800 outline-none transition-colors" 
              />
              <input 
                type="text" placeholder="Fabric" value={formData.fabric} onChange={e => setFormData({...formData, fabric: e.target.value})}
                className="w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white py-3.5 px-4 font-black focus:ring-2 focus:ring-blue-500 border border-transparent dark:border-slate-800 outline-none transition-colors" 
              />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                <Ruler size={14}/> Stock Matrix
              </h3>
              <button type="button" onClick={() => setFormData({...formData, inventory: [...formData.inventory, { size: '', quantity: 0 }]})}
                className="text-blue-600 text-xs font-black flex items-center gap-1 hover:text-blue-700 transition-colors">
                <Plus size={16}/> ADD SIZE
              </button>
            </div>
            {formData.inventory.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <select required value={item.size} onChange={e => {
                  const newInv = [...formData.inventory];
                  newInv[index].size = e.target.value;
                  setFormData({...formData, inventory: newInv});
                }} className="flex-1 rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white py-3.5 px-4 text-sm font-bold border border-transparent dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                  <option value="" className="text-gray-500">Select Size</option>
                  {sizes?.data?.map(s => <option key={s._id} value={s._id}>{s.label}</option>)}
                </select>
                <input type="number" required value={item.quantity} onChange={e => {
                  const newInv = [...formData.inventory];
                  newInv[index].quantity = e.target.value;
                  setFormData({...formData, inventory: newInv});
                }} className="w-32 rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white py-3.5 px-4 text-sm font-black border border-transparent dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 text-center transition-colors" />
                <button type="button" onClick={() => setFormData({...formData, inventory: formData.inventory.filter((_, i) => i !== index)})}
                  disabled={formData.inventory.length === 1} className="text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors disabled:opacity-50">
                  <Trash2 size={20}/>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Product Visual</h3>
            <div className="relative aspect-square rounded-[32px] bg-gray-50 dark:bg-slate-950/50 border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden transition-all hover:border-blue-300 dark:hover:border-blue-500 group">
              {isCompressing && <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-10 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-blue-600"/><p className="text-[10px] font-black mt-2 dark:text-gray-300">Processing...</p></div>}
              {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="text-center"><UploadCloud className="text-gray-300 dark:text-slate-600 mx-auto mb-2" size={48} /><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Visual</p></div>}
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
             <select required value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})}
               className="w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white py-3.5 px-4 text-sm font-bold border border-transparent dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
               <option value="" className="text-gray-500">Select Vendor</option>
               {vendors?.data?.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
             </select>
             <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value, subCategory: ''})}
               className="w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white py-3.5 px-4 text-sm font-bold border border-transparent dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
               <option value="" className="text-gray-500">Choose Category</option>
               {categories?.data?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
             </select>
             <select value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})}
               disabled={!formData.category} className="w-full rounded-2xl bg-gray-50 dark:bg-slate-950/50 text-gray-900 dark:text-white py-3.5 px-4 text-sm font-bold border border-transparent dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors">
               <option value="" className="text-gray-500">Choose Sub</option>
               {subCategories?.data?.filter(s => s.parentCategory?._id === formData.category).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
             </select>
          </div>

          <button type="submit" disabled={createMutation.isPending || updateMutation.isPending || isCompressing}
            className="w-full bg-gray-900 dark:bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-gray-200 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-3">
            {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="animate-spin" size={18} /> : <Save size={18}/>}
            {isEditMode ? 'Commit Changes' : 'Deploy Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;