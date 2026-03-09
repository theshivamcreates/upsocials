import Gallery from "../components/Gallery";
import { useStore } from "../hooks/useStore";

export default function Home() {
  const { data } = useStore();

  return (
    <div className="w-full relative pt-4">
      <Gallery media={data.media} />
    </div>
  )
}
