import { useParams } from "react-router-dom"
import { useStore } from "../hooks/useStore"
import Gallery from "../components/Gallery"

export default function Project() {
  const { tag } = useParams()
  const { data } = useStore()

  const project = data.projects.find(p => p.tag === tag)
  const projectMedia = data.media.filter(m => m.tag === tag)

  if (!project) return <div className="p-8 text-gray-500">Project not found</div>

  return (
    <div className="w-full relative">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">
          {project.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Viewing tag: #{project.tag} &middot; {projectMedia.length} assets</p>
      </div>

      <Gallery media={projectMedia} />
    </div>
  )
}