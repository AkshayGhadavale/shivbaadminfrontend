import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/products",
});


export default function ProductPage() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });

  const categories = [
  "Formal Shirts",
  "Casual T-Shirts",
  "Trousers & Jeans",
  "Ethnic Wear",
  "Accessories",
  "Innerwear",
];

  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await API.get(
      `?search=${search}&category=${filterCategory}`
    );
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [search, filterCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (image) formData.append("image", image);

    if (editId) {
      await API.put(`/${editId}`, formData);
      setEditId(null);
    } else {
      await API.post("/", formData);
    }

    setForm({ name: "", category: "", price: "", description: "" });
    setImage(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await API.delete(`/${id}`);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Product Panel</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow mb-6 space-y-4"
      >
        <input
          className="w-full p-2 border rounded"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

       <select
  className="w-full p-2 border rounded bg-white"
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
  required
>
  <option value="">Select Category</option>
  {categories.map((cat, index) => (
    <option key={index} value={cat}>
      {cat}
    </option>
  ))}
</select>

        <input
          type="number"
          className="w-full p-2 border rounded"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Search + Filter */}
      <div className="flex gap-4 mb-4">
        <input
          className="p-2 border rounded w-full"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

       <select
  className="p-2 border rounded"
  onChange={(e) => setFilterCategory(e.target.value)}
>
  <option value="">All Categories</option>
  {categories.map((cat, index) => (
    <option key={index} value={cat}>
      {cat}
    </option>
  ))}
</select>
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Category</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t text-center">
              <td className="p-2">
                {p.image && (
                  <img
                    src={`http://localhost:5000/uploads/${p.image}`}
                    className="w-16 mx-auto"
                  />
                )}
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹ {p.price}</td>
              <td className="space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}