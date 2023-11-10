// Fetch the brands and populate the dropdown
function fetchBrands() {
  fetch('http://makeup-api.herokuapp.com/api/v1/products.json')
    .then(response => response.json())
    .then(data => {
      const brands = data.map(item => item.brand).filter((value, index, self) => self.indexOf(value) === index);

      const brandDropdown = document.getElementById('brandDropdown');

      brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.text = brand;
        brandDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error fetching brands:", error);
    });
}

// Fetch and display products by selected brand
function getProductsByBrand() {
  const selectedBrand = document.getElementById('brandDropdown').value;

  fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${selectedBrand}`)
    .then(response => response.json())
    .then(data => {
      populateProductTypes(data);
      displayProducts(data);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      document.getElementById("productList").innerHTML = "Error fetching products.";
    });
}

// Populate product types dropdown
function populateProductTypes(data) {
  const productTypeDropdown = document.getElementById('productTypeDropdown');
  productTypeDropdown.innerHTML = '<option value="">All</option>';

  const productTypes = data.map(item => item.product_type).filter((value, index, self) => self.indexOf(value) === index);

  productTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.text = type;
    productTypeDropdown.appendChild(option);
  });
}

// Fetch and display products by selected type
function getProductsByType() {
  const selectedBrand = document.getElementById('brandDropdown').value;
  const selectedType = document.getElementById('productTypeDropdown').value;

  let url = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${selectedBrand}`;
  if (selectedType) {
    url += `&product_type=${selectedType}`;
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayProducts(data);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      document.getElementById("productList").innerHTML = "Error fetching products.";
    });
}

// Display products in the list
function displayProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = '';

  products.forEach(product => {
    const li = document.createElement('li');
    const productDetailsDiv = document.createElement('div');

    const imageDiv = document.createElement('div');
    if (product.image_link) {
      const img = document.createElement('img');
      img.src = product.image_link;
      img.dataset.description = product.description || '';
      img.dataset.productLink = product.product_link || '';
      img.dataset.productType = product.product_type || 'Product type not available';
      img.style.maxWidth = '200px';
      img.classList.add('productImage');
      imageDiv.appendChild(img);
    }

    productDetailsDiv.appendChild(imageDiv);

    const productNameDiv = document.createElement('div');
    productNameDiv.innerHTML = `<p><b>${product.name}</b></p> <br>`;
    productDetailsDiv.appendChild(productNameDiv);

    const priceDiv = document.createElement('div');
    if (product.price) {
      priceDiv.innerHTML = `<b>Price:</b> $${product.price}`;
    } else {
      priceDiv.innerHTML = `<b>Price:</b> Price not available`;
    }
    productDetailsDiv.appendChild(priceDiv);

    li.appendChild(productDetailsDiv);
    productList.appendChild(li);
  });
}

// Open modal to display description, product link, and product type
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('productImage')) {
    const description = event.target.dataset.description || 'Description not available';
    const productLink = event.target.dataset.productLink || 'Product link not available';
    const productType = event.target.dataset.productType || 'Product type not available';

    displayModal(description, productLink, productType);
  }
});

// Function to display the modal with description, product link, and product type
function displayModal(description, productLink, productType) {
  const modal = document.getElementById('makeupModal');
  const descriptionSpan = document.getElementById('descriptionSpan');
  const productLinkSpan = document.getElementById('productLinkSpan');
  const productTypeSpan = document.getElementById('productTypeSpan');

  descriptionSpan.textContent = description;
  productLinkSpan.innerHTML = productLink !== 'Product link not available' ?
    `<a href="${productLink}" target="_blank">Buy Now!</a>` : 'Product link not available';
  productTypeSpan.textContent = productType || 'Product type not available';

  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  document.getElementById('makeupModal').style.display = 'none';
}

// Fetch brands when the page loads
fetchBrands();
