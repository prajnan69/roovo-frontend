"use client";

// SearchBar import is no longer needed on this page
import HomeFeed from '../components/HomeFeed';
// import BottomNavBar from '../components/BottomNavBar'; // No longer needed

export default function Home() {
  return (
    // The background color is set for the entire page container
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      
      {/* 
        The <main> tag now directly holds the page's primary content.
        There's no need for extra wrappers, flex centering, or titles,
        as the HomeFeed component handles its own internal layout.
      */}
      <main>
        <HomeFeed />
      </main>

      {/* The BottomNavBar remains at the end of the page flow */}
      {/* <BottomNavBar /> */}

    </div>
  );
}
