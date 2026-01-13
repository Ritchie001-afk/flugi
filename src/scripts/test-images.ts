
import { getDestinationImage } from '../lib/images';

const testCases = [
    { dest: "Treviso, Itálie", fallback: "http://thumb.jpg" },
    { dest: "Londýn, Velká Británie", fallback: "http://thumb.jpg" },
    { dest: "Unknown City", fallback: "http://thumb.jpg" },
    { dest: "", fallback: "http://thumb.jpg" }
];

console.log("Testing Image Logic:");
testCases.forEach(tc => {
    const result = getDestinationImage(tc.dest, tc.fallback);
    console.log(`Dest: "${tc.dest}" -> Result: ${result.substring(0, 50)}...`);

    if (result === tc.fallback && tc.dest !== "Unknown City" && tc.dest !== "") {
        console.error("FAIL: Should have matched a premium image!");
    } else if (result !== tc.fallback) {
        console.log("SUCCESS: Mapped to premium image.");
    }
});
