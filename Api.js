// LOCALSTORAGE

let localProductsStorage = [];
let Products;
// If local storage is empty then -> setting the key porduct to null  and fetching data through api call and storing it to localstorage and also displaying in the table
if (localStorage.getItem("Product_Data") == null) {
  localStorage.setItem("Product_Data", "[]");

  console.log("Data fetched through api call");
  fetch("https://fakestoreapi.com/products/")
    // The .then also return a promise
    .then((response) => {
      return response.json(); // Data in json.parse and not .text()
    })

    // Output -> Accept/Reject
    .then((ProdcutsResponseReturned) => {
      // Previous Promise returns response -> stored in the Output data
      // Products Data storage to local storage -> on first api call
      localProductsStorage = localStorage.setItem(
        "Product_Data",
        JSON.stringify(ProdcutsResponseReturned)
      );
      Products = ProdcutsResponseReturned;
      data(); //Called if data fetched through api call
    });
}
// Getting data from local storage if local storage is not empty and displaying on Table
else {
  console.log("Data fetched from local storage");

  localProductsStorage = JSON.parse(localStorage.getItem("Product_Data"));
  Products = localProductsStorage;
  data();
}
// Function called if Data fetched from localstorage and if data fetched through api call(On Basis of conditions)
function data() {
  let heading_title = document.querySelectorAll(".Heading_title");

  for (let i = 0; i <= 0; i++) {
    let keys_array = Object.keys(Products[i++]);
    let n = 0;
    // Loop for all 7 headings
    for (let k = 0; k < heading_title.length; k++) {
      let keys_data = keys_array[n++];
      keys_data = keys_data.charAt(0).toUpperCase() + keys_data.slice(1);
      heading_title[k].innerText = keys_data;
    }
  }

  // All the data is fetched through api call response return and added as +
  let AllProdcuts = Products.map(function (Data) {
    return `${Data.id} + ${Data.title}  + ${Data.price} + ${Data.description}  + ${Data.category} + ${Data.image} + ${Data.rating.rate} + ${Data.rating.count}`;
  });

  // Getting all Rows
  let TableRows = document.getElementsByClassName("Product");

  // CurrentData a new array -> Data(Old array) -> getting all the Products and splitting whenever the + appears
  let CurrentProduct = AllProdcuts.map(function (value) {
    return value.split("+");
  });

  let j = 0;

  for (let i = 0; i < CurrentProduct.length; i++) {
    if (j <= TableRows.length) {
      //TableRows[j].childElementCount; -> Total of 8 child elements

      // Getting all the child elements of the current <tr> using <td> -> loop and set the inner html -> CurentData[i][k] -> Refers to each element of the array CurrentData
      let TableTDData = TableRows[j].getElementsByTagName("td");

      for (var k = 0; k < TableTDData.length; k++) {
        // console.log(TableTDData[k].childElementCount)
        if (TableTDData[k].childElementCount == 0) {
          TableTDData[k].innerHTML = CurrentProduct[i][k];
        } else {
          TableTDData[k].children[0].src = CurrentProduct[i][k];
        }
      }
      j++; //J++ gets to the next row
    }
  }
}
// SEARCH Products
function searchBar() {
  let InputTobeSearched = document
    .getElementById("Input-field")
    .value.toUpperCase(); //Gets User Input and Convert to -> uPPERCASE-> Then save to a var
  let TableRowsSearched = document
    .getElementById("table")
    .getElementsByClassName("Product"); // Gets all rows

  for (let i = 0; i < TableRowsSearched.length; i++) {
    // Loop through each row
    let TableTDSearched = TableRowsSearched[i].getElementsByTagName("td"); // Store the current row all <td> in a var -> NodeList[]
    let AllTextContentofTd = ""; // a empty var
    for (let ind = 0; ind < TableTDSearched.length; ind++) {
      // Looping through the td in NodeList
      AllTextContentofTd += TableTDSearched[ind].innerText; // Get all <td> innertext -> add it to the var value
    }
    if (TableTDSearched) {
      // If <Td> is true/exist
      if (AllTextContentofTd.toUpperCase().indexOf(InputTobeSearched) > -1) {
        // all <td> innertext -> added to var  AllTextContentofTd -> then converted whole value to upperCase -> Then find the index of the user input from the var value -> If user input exist in var value it will return its index -> else it return -1 -> if it returns index greater then -1 -> condition true means the text exist in current var value ->> hence show whole row -> else hide that row
        TableRowsSearched[i].style.display = "";
      } else {
        TableRowsSearched[i].style.display = "none";
      }
    }
  }
}
// EDIT Products
var td = document.getElementsByTagName("td"); //Get all Tds from Table
for (
  let i = 0;
  i < td.length;
  i++ //Loop through each td
) {
  td[i].onclick = function () {
    // When clicked on certain TD -> Runs the function
    if (td[i].childElementCount == 0) {
      //If its childcount is 0 -> Have no child element -> Need this in case of Images -> Td having images (ChildElementCount!=0) cant be edited.
      let OldValue = td[i].innerText; //Save the old Value
      td[i].contentEditable = "true"; //Allow the TD to be edited -> Its an html attribute Property -> User can edit the Data here
      td[i].onblur = function () {
        //On blur -> Function
        let NewValue = td[i].innerText; //Save the new Edited value
        let RemovedAllSpecialCharacters = NewValue.replace(
          /[&\/\\#,+()$~%'":*?<>{}]/g,
          ""
        ); //Remove all special characters from the data and then save it in local storage as special characters like {} [] etc can cause issue
        let localStorageData = localStorage.getItem("Product_Data"); //Getting the Old data from local storage so we can update it -> Data fetched is in string form
        let replacedData = localStorageData.replace(
          OldValue,
          RemovedAllSpecialCharacters
        ); //We gonna replace the OLDVALUE with the NewEditedValue having no Special characters -> Store it in a var
        localStorage.setItem("Product_Data", replacedData); // Setting the ReplacedData(Already in form of STRING)  -> As the Products_Data(Key) new VALUE(Replaceddata) -> Onreload user gets updated data
      };
    }
  };
}
// SORT Produts
let AscendingOrder = true; //Setting To true
function Sorting() {
  //Onlick on Sorting Icon - Runs the function
  if (AscendingOrder) {
    //For first click true
    let Price = function (a, b) {
      //Array the Price in the Ascending Order -> Comapre Function is used If (a<b -> a b || a>b -> b a || a=b -> a,b or b,a)
      return a.price - b.price;
    };
    Products.sort(Price); //Using Sort function
    AscendingOrder = false; //Setting to false -> Heece on next click -> First condition wont be satisfied -> hence second condition work -> Arrange from asceninf to descening order
    data(); //Function defined above is called and hence Product(New data sorted by Price) will be maped
    toastr.info("Sorted By Price-Ascending order", "Note:", {
      iconClass: "Toastr_style",
      positionClass: "toast-bottom-right",
      showDuration: "100",
      closeButton: true,
      progressBar: false,
      preventDuplicates: true,
    }); //Message to show suer that its arranged either by Ascending Order or Descending Order
  } else if (!AscendingOrder) {
    //On secong click -> first condition False -> 2nd condition TRUE -> Array from Asceing to Desecending order
    let Price = function (a, b) {
      return b.price - a.price;
    }; //Arrange to Descending order
    Products.sort(Price);
    AscendingOrder = true; //Again set to TRUE -> On next click -> Arranges from -> Descending Order to Ascending Order
    data();
    toastr.info("Sorted By Price-Descending Order", "Note:", {
      iconClass: "Toastr_style",
      positionClass: "toast-bottom-right",
      showDuration: "100",
      closeButton: true,
      progressBar: false,
      preventDuplicates: true,
    }); //Message to show suer that its arranged either by Ascending Order or Descending Order
  }
}

// PAGINATION
let first10 = document.getElementsByClassName("PaginationFirst10"); //First 10 Rows
let Last10 = document.getElementsByClassName("PaginationLast10"); //Last 10 ROWS
for (let i = 0; i < Last10.length; i++) {
  Last10[i].style.display = "none"; //Loop that -> Hide Last 10 ROWS
}
function Next() {
  //On click -> Next Button -> Hide->FIRST 10 Rows && Display-> Last 10 Rows
  for (let i = 0; i < first10.length; i++) {
    console.log("Display");
    first10[i].style.display = "none"; //Hide -> First 10 Rows
  }
  for (let j = 0; j < Last10.length; j++) {
    //Display Last 10 Hidden Rows
    console.log("Display");
    Last10[j].style.display = "";
  }
}
function Previous() {
  //On click -> Previos Button -> Hide -> Last 10 Rows && Display-> First 10 Rows
  for (let i = 0; i < Last10.length; i++) {
    console.log("Display");
    Last10[i].style.display = "none"; //Hide Last 10 Rows
  }
  for (let j = 0; j < first10.length; j++) {
    //Display First 10 ROWS
    console.log("Display");
    first10[j].style.display = "";
  }
}
