import { useParams, Navigate } from "react-router-dom";
import Gallery from "../components/Gallery";
import { useStore } from "../hooks/useStore";

export default function Niche() {
  const { tag } = useParams();
  const { data } = useStore();

  const niche = (data.niches || []).find(n => n.tag === tag);
  const nicheMedia = data.media.filter(m => m.niche === tag);

  if (!niche) return <Navigate to="/" replace />;

  return (
    <div className="w-full relative pt-4">
      <div className="mb-8 pt-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 uppercase">
          {niche.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Viewing tag: #{niche.tag} &middot; {nicheMedia.length} assets</p>
      </div>
      <Gallery media={nicheMedia} />
    </div>
  )
}
