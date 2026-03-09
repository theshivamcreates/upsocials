import { useState } from "react";
import { useStore } from "../hooks/useStore";

export default function Admin() {
  const { data, save } = useStore();
  const [loading, setLoading] = useState(false);

  // Form states for adding new
  const [newProject, setNewProject] = useState({ name: "", tag: "" });
  const [newMedia, setNewMedia] = useState({ url: "", type: "image", tag: "" });

  const handleSave = async (newData) => {
    setLoading(true);
    await save(newData);
    // Reloading forces HMR to fetch the updated JSON since it's statically imported in useStore
    window.location.reload();
  };

  const addProject = () => {
    if (!newProject.name || !newProject.tag) return alert("Fill project details");
    const proj = { ...newProject, id: Date.now().toString() };
    handleSave({ ...data, projects: [...data.projects, proj] });
  };

  const removeProject = (id) => {
    handleSave({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const addMedia = () => {
    if (!newMedia.url || !newMedia.tag) return alert("Fill media details");
    const item = { ...newMedia, id: Date.now().toString() };
    handleSave({ ...data, media: [...data.media, item] });
  };

  const removeMedia = (id) => {
    handleSave({ ...data, media: data.media.filter(m => m.id !== id) });
  };

  if (loading) return <div className="p-8">Saving to system files... Reloading...</div>;

  return (
    <div className="p-8 max-w-4xl font-mono text-sm border-l sm:ml-64 md:ml-0 md:border-l-0">
      <h1 className="text-2xl font-bold mb-8 text-black">ADMIN PANEL</h1>
      <p className="text-gray-500 mb-8 border-b pb-4">
        Changes made here are permanently written directly to your `src/data/store.json` file.
      </p>

      {/* PROJECTS SECTION */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4 bg-gray-100 uppercase p-2">Projects</h2>
        <div className="flex gap-2 mb-6 text-xs">
          <input
            type="text"
            placeholder="Project Name (e.g. Puma Suede AW22)"
            value={newProject.name}
            onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            className="border p-2 w-64 outline-none"
          />
          <input
            type="text"
            placeholder="Unique Tag (e.g. puma-suede)"
            value={newProject.tag}
            onChange={e => setNewProject({ ...newProject, tag: e.target.value.toLowerCase().replace(/\\s+/g, '-') })}
            className="border p-2 w-48 outline-none"
          />
          <button onClick={addProject} className="bg-black text-white px-4 cursor-pointer hover:bg-gray-800">
            ADD PROJECT
          </button>
        </div>

        <ul className="space-y-2">
          {data.projects.map(p => (
            <li key={p.id} className="flex justify-between items-center border p-2 bg-gray-50">
              <span><strong>{p.name}</strong>
                <span className="text-gray-400 ml-2">[{p.tag}]</span>
              </span>
              <button
                onClick={() => removeProject(p.id)}
                className="text-red-500 hover:text-red-700 underline text-xs cursor-pointer"
              >
                Remove
              </button>
            </li>
          ))}
          {data.projects.length === 0 && <span className="text-gray-400">No projects exist.</span>}
        </ul>
      </section>

      {/* MEDIA SECTION */}
      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4 bg-gray-100 uppercase p-2">Media Files</h2>
        <div className="flex gap-2 mb-6 text-xs flex-wrap">
          <input
            type="text"
            placeholder="Media URL"
            value={newMedia.url}
            onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
            className="border p-2 flex-grow outline-none min-w-[200px]"
          />
          <select
            value={newMedia.type}
            onChange={e => setNewMedia({ ...newMedia, type: e.target.value })}
            className="border p-2 outline-none"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <select
            value={newMedia.tag}
            onChange={e => setNewMedia({ ...newMedia, tag: e.target.value })}
            className="border p-2 outline-none"
          >
            <option value="" disabled>Select Project Tag</option>
            {data.projects.map(p => <option key={p.id} value={p.tag}>{p.tag}</option>)}
          </select>
          <button onClick={addMedia} className="bg-black text-white px-4 cursor-pointer hover:bg-gray-800 h-10">
            ADD MEDIA
          </button>
        </div>

        <ul className="space-y-2">
          {data.media.map(m => (
            <li key={m.id} className="flex justify-between items-center border-b p-2">
              <div className="flex items-center space-x-4 max-w-[80%]">
                <span className={`px-2 py-1 text-[10px] uppercase font-bold \${m.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                  {m.type}
                </span>
                <span className="truncate">{m.url}</span>
                <span className="text-gray-400 min-w-max border px-1">Tag: {m.tag}</span>
              </div>
              <button
                onClick={() => removeMedia(m.id)}
                className="text-red-500 hover:text-red-700 underline text-xs cursor-pointer"
              >
                Remove
              </button>
            </li>
          ))}
          {data.media.length === 0 && <span className="text-gray-400">No media exists.</span>}
        </ul>
      </section>
    </div>
  );
}
