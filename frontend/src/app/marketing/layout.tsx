import "../globals.css";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}

// <div className="group relative overflow-hidden rounded-xl bg-gray-900 mt-8">
//     <Image
//         src={photoUrl}
//         alt="women"
//         width={400}
//         height={600}
//         className="transition-transform duration-300 group-hover:scale-110 object-cover"
//     />
//     <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black to-transparent w-full">
//         {/* Displaying ID here since we don't have a name anymore */}
//         <p className="text-white font-bold uppercase">
//             User {data.photos[0].photographer}, 24
//         </p>
//         <p className="text-gray-300 text-sm capitalize">women</p>
//     </div>
// </div>
// const API_KEY = "CVy-N_gYKxbqE1lj6psorTzLCWrP8kt5UEhmixdu7-A";
// const API_KEY = "Q4DxSkR1aWPuKu1Evs2zCnRPFjb0ePP9k1xrMyb9UyMK82rLlTjqTJHN";

// const res = await fetch("https://api.pexels.com/v1/search?query=woman portrait&per_page=1", {
//     headers: { Authorization: API_KEY }
// })

// if (!res.ok) {
//     return <div>Failed to load from Unsplash</div>;
// }

// const data = await res.json();
// const photoUrl = data.photos[0].src.original;
