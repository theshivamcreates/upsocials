import { useState } from "react";
import { useStore } from "../hooks/useStore";

export default function Admin() {
  const { data, save } = useStore();
  const [loading, setLoading] = useState(false);

  // Form states for adding new
  const [newProject, setNewProject] = useState({ name: "", tag: "" });
  const [newNiche, setNewNiche] = useState({ name: "", tag: "" });
  const [newMedia, setNewMedia] = useState({ url: "", type: "image", tag: "", niche: "" });
  const [newTeamMember, setNewTeamMember] = useState({ name: "", work: "", experience: "", photo: "", badge: "" });

  const [editingMediaId, setEditingMediaId] = useState(null);
  const [editingMediaData, setEditingMediaData] = useState({ tag: "", niche: "" });

  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingTeamData, setEditingTeamData] = useState({ name: "", work: "", experience: "", photo: "", badge: "" });

  const [selectedProjects, setSelectedProjects] = useState(new Set());
  const [selectedNiches, setSelectedNiches] = useState(new Set());
  const [selectedMedia, setSelectedMedia] = useState(new Set());
  const [selectedTeam, setSelectedTeam] = useState(new Set());

  const toggleSelection = (setFn, id) => {
    setFn(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const deleteSelected = (type) => {
    let newData = { ...data };
    if (type === 'projects') {
      if (!confirm(`Delete ${selectedProjects.size} projects?`)) return;
      newData.projects = data.projects.filter(p => !selectedProjects.has(p.id));
      setSelectedProjects(new Set());
    } else if (type === 'niches') {
      if (!confirm(`Delete ${selectedNiches.size} niches?`)) return;
      newData.niches = (data.niches || []).filter(n => !selectedNiches.has(n.id));
      setSelectedNiches(new Set());
    } else if (type === 'media') {
      if (!confirm(`Delete ${selectedMedia.size} media files?`)) return;
      newData.media = data.media.filter(m => !selectedMedia.has(m.id));
      setSelectedMedia(new Set());
    } else if (type === 'team') {
      if (!confirm(`Delete ${selectedTeam.size} team members?`)) return;
      newData.team = (data.team || []).filter(t => !selectedTeam.has(t.id));
      setSelectedTeam(new Set());
    }
    handleSave(newData);
  };

  const moveNiche = (index, direction) => {
    const nichesList = [...(data.niches || [])];
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === nichesList.length - 1) return;
    const temp = nichesList[index];
    nichesList[index] = nichesList[index + direction];
    nichesList[index + direction] = temp;
    handleSave({ ...data, niches: nichesList });
  };

  const moveTeam = (index, direction) => {
    const teamList = [...(data.team || [])];
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === teamList.length - 1) return;
    const temp = teamList[index];
    teamList[index] = teamList[index + direction];
    teamList[index + direction] = temp;
    handleSave({ ...data, team: teamList });
  };

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

  const addNiche = () => {
    if (!newNiche.name || !newNiche.tag) return alert("Fill niche details");
    const nicheObj = { ...newNiche, id: Date.now().toString() };
    handleSave({ ...data, niches: [...(data.niches || []), nicheObj] });
  };

  const removeNiche = (id) => {
    handleSave({ ...data, niches: (data.niches || []).filter(n => n.id !== id) });
  };

  const addMedia = () => {
    if (!newMedia.url || !newMedia.tag || !newMedia.niche) return alert("Fill all media details");
    const item = { ...newMedia, id: Date.now().toString() };
    handleSave({ ...data, media: [...data.media, item] });
  };

  const removeMedia = (id) => {
    handleSave({ ...data, media: data.media.filter(m => m.id !== id) });
  };

  const saveMediaEdit = (id) => {
    const updatedMedia = data.media.map(m => m.id === id ? { ...m, tag: editingMediaData.tag, niche: editingMediaData.niche } : m);
    handleSave({ ...data, media: updatedMedia });
    setEditingMediaId(null);
  };

  const addTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.work) return alert("Name and work role are required");
    const member = { ...newTeamMember, id: Date.now().toString() };
    handleSave({ ...data, team: [...(data.team || []), member] });
            setNewTeamMember({ name: "", work: "", experience: "", photo: "", badge: "" });
  };

  const saveTeamEdit = (id) => {
    if (!editingTeamData.name || !editingTeamData.work) return alert("Name and work role are required");
    const updatedTeam = (data.team || []).map(t => t.id === id ? { ...t, ...editingTeamData } : t);
    handleSave({ ...data, team: updatedTeam });
    setEditingTeamId(null);
  };

  const removeTeamMember = (id) => {
    handleSave({ ...data, team: (data.team || []).filter(t => t.id !== id) });
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
        <div className="flex justify-between items-center mb-4 bg-gray-100 p-2">
          <h2 className="text-lg font-bold uppercase">Projects</h2>
          {selectedProjects.size > 0 && (
            <button onClick={() => deleteSelected('projects')} className="bg-red-500 text-white px-3 py-1 text-xs cursor-pointer hover:bg-red-600">
              DELETE SELECTED ({selectedProjects.size})
            </button>
          )}
        </div>
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
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={selectedProjects.has(p.id)} 
                  onChange={() => toggleSelection(setSelectedProjects, p.id)} 
                  className="cursor-pointer w-4 h-4"
                />
                <span><strong>{p.name}</strong>
                  <span className="text-gray-400 ml-2">[{p.tag}]</span>
                </span>
              </div>
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

      {/* NICHES SECTION */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4 bg-gray-100 p-2">
          <h2 className="text-lg font-bold uppercase">Niches (Homepage Rows)</h2>
          {selectedNiches.size > 0 && (
            <button onClick={() => deleteSelected('niches')} className="bg-red-500 text-white px-3 py-1 text-xs cursor-pointer hover:bg-red-600">
              DELETE SELECTED ({selectedNiches.size})
            </button>
          )}
        </div>
        <div className="flex gap-2 mb-6 text-xs">
          <input
            type="text"
            placeholder="Niche Name (e.g. Fashion)"
            value={newNiche.name}
            onChange={e => setNewNiche({ ...newNiche, name: e.target.value })}
            className="border p-2 w-64 outline-none"
          />
          <input
            type="text"
            placeholder="Unique Tag (e.g. fashion)"
            value={newNiche.tag}
            onChange={e => setNewNiche({ ...newNiche, tag: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            className="border p-2 w-48 outline-none"
          />
          <button onClick={addNiche} className="bg-black text-white px-4 cursor-pointer hover:bg-gray-800">
            ADD NICHE
          </button>
        </div>

        <ul className="space-y-2">
          {(data.niches || []).map((n, index) => (
            <li key={n.id} className="flex justify-between items-center border p-2 bg-gray-50">
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={selectedNiches.has(n.id)} 
                  onChange={() => toggleSelection(setSelectedNiches, n.id)} 
                  className="cursor-pointer w-4 h-4"
                />
                <span><strong>{n.name}</strong>
                  <span className="text-gray-400 ml-2">[{n.tag}]</span>
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col space-y-1">
                  <button onClick={() => moveNiche(index, -1)} disabled={index === 0} className={`text-[10px] border px-1 font-bold ${index === 0 ? 'opacity-30' : 'hover:bg-gray-200 bg-white'} cursor-pointer leading-none py-1`}>▲</button>
                  <button onClick={() => moveNiche(index, 1)} disabled={index === (data.niches || []).length - 1} className={`text-[10px] border px-1 font-bold ${index === (data.niches || []).length - 1 ? 'opacity-30' : 'hover:bg-gray-200 bg-white'} cursor-pointer leading-none py-1`}>▼</button>
                </div>
                <button
                  onClick={() => removeNiche(n.id)}
                  className="text-red-500 hover:text-red-700 underline text-xs cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          {(!data.niches || data.niches.length === 0) && <span className="text-gray-400">No niches exist.</span>}
        </ul>
      </section>

      {/* MEDIA SECTION */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4 bg-gray-100 p-2">
          <h2 className="text-lg font-bold uppercase">Media Files</h2>
          {selectedMedia.size > 0 && (
            <button onClick={() => deleteSelected('media')} className="bg-red-500 text-white px-3 py-1 text-xs cursor-pointer hover:bg-red-600">
              DELETE SELECTED ({selectedMedia.size})
            </button>
          )}
        </div>
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
            className="border p-2 outline-none w-32"
          >
            <option value="" disabled>Project Tag</option>
            {data.projects.map(p => <option key={p.id} value={p.tag}>{p.tag}</option>)}
          </select>
          <select
            value={newMedia.niche}
            onChange={e => setNewMedia({ ...newMedia, niche: e.target.value })}
            className="border p-2 outline-none w-32"
          >
            <option value="" disabled>Niche Tag</option>
            {(data.niches || []).map(n => <option key={n.id} value={n.tag}>{n.tag}</option>)}
          </select>
          <button onClick={addMedia} className="bg-black text-white px-4 cursor-pointer hover:bg-gray-800 h-10">
            ADD MEDIA
          </button>
        </div>

        <ul className="space-y-2">
          {data.media.map(m => (
            <li key={m.id} className="flex justify-between items-center border-b p-2">
              <div className="flex items-center space-x-4 max-w-[80%]">
                <input 
                  type="checkbox" 
                  checked={selectedMedia.has(m.id)} 
                  onChange={() => toggleSelection(setSelectedMedia, m.id)} 
                  className="cursor-pointer w-4 h-4 flex-shrink-0"
                />
                <span className={`px-2 py-1 text-[10px] uppercase font-bold flex-shrink-0 ${m.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                  {m.type}
                </span>
                <span className="truncate max-w-[300px] overflow-hidden whitespace-nowrap" title={m.url}>{m.url}</span>
                
                {editingMediaId === m.id ? (
                  <div className="flex space-x-2 text-xs">
                    <select
                      value={editingMediaData.tag}
                      onChange={e => setEditingMediaData({ ...editingMediaData, tag: e.target.value })}
                      className="border p-1 outline-none"
                    >
                      {data.projects.map(p => <option key={p.id} value={p.tag}>{p.tag}</option>)}
                    </select>
                    <select
                      value={editingMediaData.niche}
                      onChange={e => setEditingMediaData({ ...editingMediaData, niche: e.target.value })}
                      className="border p-1 outline-none"
                    >
                      {(data.niches || []).map(n => <option key={n.id} value={n.tag}>{n.tag}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="flex space-x-2 text-xs text-gray-500">
                    <span className="border px-1 bg-white">Tag: {m.tag}</span>
                    <span className="border px-1 bg-white">Niche: {m.niche || 'unassigned'}</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                {editingMediaId === m.id ? (
                  <button onClick={() => saveMediaEdit(m.id)} className="text-green-600 hover:text-green-800 underline text-xs cursor-pointer font-bold">Save</button>
                ) : (
                  <button onClick={() => { setEditingMediaId(m.id); setEditingMediaData({ tag: m.tag, niche: m.niche || '' }); }} className="text-blue-500 hover:text-blue-700 underline text-xs cursor-pointer">Edit</button>
                )}
                <button
                  onClick={() => removeMedia(m.id)}
                  className="text-red-500 hover:text-red-700 underline text-xs cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          {data.media.length === 0 && <span className="text-gray-400">No media exists.</span>}
        </ul>
      </section>

      {/* TEAM SECTION */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4 bg-gray-100 p-2">
          <h2 className="text-lg font-bold uppercase">Team Members</h2>
          {selectedTeam.size > 0 && (
            <button onClick={() => deleteSelected('team')} className="bg-red-500 text-white px-3 py-1 text-xs cursor-pointer hover:bg-red-600">
              DELETE SELECTED ({selectedTeam.size})
            </button>
          )}
        </div>
        <div className="flex flex-col gap-2 mb-6 text-xs bg-gray-50 p-4 border">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Name *"
              value={newTeamMember.name}
              onChange={e => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
              className="border p-2 w-1/4 outline-none"
            />
            <input
              type="text"
              placeholder="Work/Role *"
              value={newTeamMember.work}
              onChange={e => setNewTeamMember({ ...newTeamMember, work: e.target.value })}
              className="border p-2 w-1/4 outline-none"
            />
            <input
              type="text"
              placeholder="Badge (e.g. Founder)"
              value={newTeamMember.badge}
              onChange={e => setNewTeamMember({ ...newTeamMember, badge: e.target.value })}
              className="border p-2 w-1/4 outline-none"
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={newTeamMember.photo}
              onChange={e => setNewTeamMember({ ...newTeamMember, photo: e.target.value })}
              className="border p-2 w-1/4 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Experience (optional short description)"
              value={newTeamMember.experience}
              onChange={e => setNewTeamMember({ ...newTeamMember, experience: e.target.value })}
              className="border p-2 flex-grow outline-none"
            />
            <button onClick={addTeamMember} className="bg-black text-white px-6 cursor-pointer hover:bg-gray-800">
              ADD MEMBER
            </button>
          </div>
        </div>

        <ul className="space-y-2">
          {(data.team || []).map((member, index) => (
            <li key={member.id} className="flex justify-between items-center border p-3 flex-wrap sm:flex-nowrap gap-4">
              <div className="flex items-center space-x-4 max-w-full">
                <input 
                  type="checkbox" 
                  checked={selectedTeam.has(member.id)} 
                  onChange={() => toggleSelection(setSelectedTeam, member.id)} 
                  className="cursor-pointer w-4 h-4 flex-shrink-0"
                />
                
                {member.photo && (
                  <img src={member.photo} alt={member.name} className="w-10 h-10 object-cover rounded flex-shrink-0 bg-gray-100" />
                )}
                
                {editingTeamId === member.id ? (
                  <div className="flex flex-col gap-2 w-full min-w-[250px]">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingTeamData.name} 
                        onChange={e => setEditingTeamData({ ...editingTeamData, name: e.target.value })} 
                        className="border p-1 text-xs outline-none flex-1" 
                        placeholder="Name" 
                      />
                      <input 
                        type="text" 
                        value={editingTeamData.work} 
                        onChange={e => setEditingTeamData({ ...editingTeamData, work: e.target.value })} 
                        className="border p-1 text-xs outline-none flex-1" 
                        placeholder="Work" 
                      />
                      <input 
                        type="text" 
                        value={editingTeamData.badge} 
                        onChange={e => setEditingTeamData({ ...editingTeamData, badge: e.target.value })} 
                        className="border p-1 text-xs outline-none w-28" 
                        placeholder="Badge" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editingTeamData.photo} 
                        onChange={e => setEditingTeamData({ ...editingTeamData, photo: e.target.value })} 
                        className="border p-1 text-xs outline-none flex-1" 
                        placeholder="Photo URL" 
                      />
                      <input 
                        type="text" 
                        value={editingTeamData.experience} 
                        onChange={e => setEditingTeamData({ ...editingTeamData, experience: e.target.value })} 
                        className="border p-1 text-xs outline-none flex-1" 
                        placeholder="Experience" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold truncate">{member.name} <span className="text-gray-400 font-normal text-xs ml-2 uppercase tracking-widest">{member.work}</span></span>
                    <span className="text-xs text-gray-500 truncate" title={member.experience}>{member.experience}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                {/* Reorder up/down arrows */}
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => moveTeam(index, -1)}
                    disabled={index === 0}
                    className={`text-[10px] border px-1 font-bold ${index === 0 ? 'opacity-30' : 'hover:bg-gray-200 bg-white'} cursor-pointer leading-none py-1`}
                  >▲</button>
                  <button
                    onClick={() => moveTeam(index, 1)}
                    disabled={index === (data.team || []).length - 1}
                    className={`text-[10px] border px-1 font-bold ${index === (data.team || []).length - 1 ? 'opacity-30' : 'hover:bg-gray-200 bg-white'} cursor-pointer leading-none py-1`}
                  >▼</button>
                </div>
                {editingTeamId === member.id ? (
                  <button onClick={() => saveTeamEdit(member.id)} className="text-green-600 hover:text-green-800 underline text-xs cursor-pointer font-bold">Save</button>
                ) : (
                  <button onClick={() => { setEditingTeamId(member.id); setEditingTeamData({ name: member.name, work: member.work, experience: member.experience, photo: member.photo || '', badge: member.badge || '' }); }} className="text-blue-500 hover:text-blue-700 underline text-xs cursor-pointer">Edit</button>
                )}
                <button
                  onClick={() => removeTeamMember(member.id)}
                  className="text-red-500 hover:text-red-700 underline text-xs cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          {(!data.team || data.team.length === 0) && <span className="text-gray-400">No team members added.</span>}
        </ul>
      </section>
    </div>
  );
}
