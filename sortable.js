let heroData = [];

// Function to display each hero in a table row
function displayHero(hero) {
  const tableRow = document.createElement("tr");

  hero.forEach((item, index) => {
    const column = document.createElement("td");

    // If the first item, assume it's an image
    if (index === 0) {
      const image = new Image();
      image.src = item;
      column.appendChild(image);
    } else {
      const textNode = document.createTextNode(item || "");
      column.appendChild(textNode);
    }

    tableRow.appendChild(column);
  });

  document.querySelector("tbody").appendChild(tableRow);
}

// Function for searching and paginating heroes
function searchHeroes(heroes, page = 1) {
  const inputText = document.querySelector("input[type='text']").value;
  const searchType = document.querySelector("[name='search']").value;
  const rowsPerPage = parseInt(document.querySelector("[name='rows']").value);

  // Clear previous rows
  document.querySelector("tbody").innerHTML = "";

  // Filter heroes based on search
  const filteredHeroes = heroes.filter((hero) =>
    hero[searchType].toUpperCase().includes(inputText.toUpperCase())
  );

  // Pagination
  const start = (page - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, filteredHeroes.length);
  const pageCount = Math.ceil(filteredHeroes.length / rowsPerPage);

  // Display pagination buttons
  const pagesContainer = document.getElementById("pages");
  pagesContainer.innerHTML = "";
  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.disabled = i === page;
    button.addEventListener("click", () => searchHeroes(heroes, i));
    if (pageCount !== 1) {
      pagesContainer.appendChild(button);
    }
  }

  // Display heroes for the current page
  for (let i = start; i < end; i++) {
    displayHero(filteredHeroes[i]);
  }
}

// Fetching hero data
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((res) => res.json())
  .then((data) => {
    
    heroData = data.map((hero) => [
      hero.images.xs,
      hero.name,
      hero.biography.fullName,
      hero.powerstats.intelligence,
      hero.powerstats.strength,
      hero.powerstats.speed,
      hero.powerstats.durability,
      hero.powerstats.power,
      hero.powerstats.combat,
      hero.appearance.gender,
      (hero.appearance.race == null)? hero.appearance.race = "" : hero.appearance.race,
      hero.appearance.height[1],
      hero.appearance.weight[1],
      hero.biography.placeOfBirth,
      hero.biography.alignment,
    ]);

    
    

    searchHeroes(heroData);
  })
  .catch((err) => console.log(`Error fetching data: ${err}`));

// Event listeners for search input and select options
document.querySelector("input[type='text']").addEventListener("keyup", () => {
  searchHeroes(heroData);
});

document.querySelectorAll("select").forEach((select) => {
  select.addEventListener("change", () => {
    searchHeroes(heroData);
  });
});

let sortDirection = {}; // Keeps track of the sort direction for each column

// Function to sort data
function sortData(columnIndex, isAscending) {
  console.log(columnIndex)
  if (columnIndex== 11 || columnIndex == 12) {
    heroData.sort(function (a, b) {
      let n1 = a[columnIndex];
      let n2 = b[columnIndex];
  
      // In case of undefined make zero value
      if (n1 == undefined) return Infinity; 
      if (n2 == undefined) return -Infinity;

      // Get only digits
     n1= n1.replace(/,/g, "")
     n2= n2.replace(/,/g, "")

      let num1 = n1.match(/\d+/)[0];
      let num2 = n2.match(/\d+/)[0];

      // For right comparison take into account meters and tons
      if (n1.includes("meters")) num1 *= 100;
      if (n2.includes("meters")) num2 *= 100;
      if (n1.includes("tons")) num1 *= 1000;
      if (n2.includes("tons")) num2 *= 1000;

      if (isAscending) {return num1 - num2;} else {return num2-num1;} 
    });
  } else {
  heroData.sort((a, b) => {
    if (a[columnIndex] == undefined || a[columnIndex] == "" || a[columnIndex] == "-"  ) return Infinity; 
    if (b[columnIndex] == undefined || b[columnIndex] == "" || b[columnIndex] == "-") return -Infinity;
    if (a[columnIndex] < b[columnIndex]) return isAscending ? -1 : 1;
    if (a[columnIndex] > b[columnIndex]) return isAscending ? 1 : -1;
    return 0;
  });}
}

// Function to handle column header click
function onColumnHeaderClick(columnIndex) {
  // Toggle sort direction or set default to ascending
  sortDirection[columnIndex] = !sortDirection[columnIndex];

  // Sort data
  sortData(columnIndex, sortDirection[columnIndex]);

  // Display sorted data
  searchHeroes(heroData);
}

// Attach event listeners to table headers
document.querySelectorAll("th").forEach((header, index) => {
  header.addEventListener("click", () => onColumnHeaderClick(index));
  sortDirection[index] = false; // Initialize sort direction as ascending
});

// Initial sort
sortData(1, true);
searchHeroes(heroData);
