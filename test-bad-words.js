const { Filter } = require("bad-words");

console.log("Filter object:", Filter);
console.log("Filter type:", typeof Filter);

try {
  const filter = new Filter();
  console.log("Testing bad-words library:");
  console.log("Clean text:", filter.clean("This is damn good"));
  console.log("Is profane:", filter.isProfane("damn"));
  console.log("Is profane (clean):", filter.isProfane("good"));
} catch (err) {
  console.error("Error:", err);
}
