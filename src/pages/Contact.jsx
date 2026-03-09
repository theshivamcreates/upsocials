export default function Contact() {
  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-black">
        Let's Create.
      </h1>
      <p className="text-gray-500 mb-12 text-lg">
        Ready to take your brand's digital presence to the next level? Reach out through our primary channels below and let's craft something cinematic.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <a
          href="https://wa.me/+917880533628"
          target="_blank"
          rel="noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 duration-300 shadow-lg flex items-center justify-center"
        >
          <span className="mr-2">💬</span> Chat on WhatsApp
        </a>

        <a
          href="https://www.instagram.com/upsocials._/"
          target="_blank"
          rel="noreferrer"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white font-bold py-4 px-8 rounded-full transition-transform hover:scale-105 duration-300 shadow-lg flex items-center justify-center"
        >
          <span className="mr-2">📸</span> DM on Instagram
        </a>
      </div>
    </div>
  )
}
