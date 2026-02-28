let products = JSON.parse(localStorage.getItem('products')) || [];

let editId = null;

window.onload = () => {
    dispalyProducts(products);
    updateCategoryFilter();
};

function addProduct(){
        const title = document.getElementById('p-title').value;
        const price = document.getElementById('p-price').value;
        const image = document.getElementById('p-image').value || 'https://www.crossword.in/cdn/shop/products/crosswordonline-toys-games-default-title-mirada-55cm-jumbo-teddy-bear-soft-toy-beige-40250340016345.jpg?v=1746619255';
        const category = document.getElementById('p-category').value;

        if(editId !== null) {
            products = products.map(p => 
                p.id === editId ? {...p, title, price, image, category} : p
            );
            
            editId = null;
            document.getElementById('add-btn').innerText = "Add Product";
        } else {
            const newProduct = {
                id: Date.now(),
                title,
                price,
                image,
                category: category || "Uncategorized"
            };
            products.push(newProduct);
        }

        saveAndRefresh();
        clearInputs();
}

function dispalyProducts(data){
    const list = document.getElementById('product-list');
    list.innerHTML = "";

    data.forEach(product => {
        list.innerHTML += `
        <div class = "product-card">
            <img src = "${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p><strong>${product.price}</strong></p>
            <p>Category : ${product.category}</p>
            <div class="card-btns">
            <button class = "edit-btn" onclick="prepareEdit(${product.id})">Edit</button>
            <button class = "delete-btn" onclick="deleteProducts(${product.id})">Delete</button>
            </div>
        </div>
        `;
    })
}

function deleteProducts(id){
    products = products.filter(p => p.id !== id);
    saveAndRefresh();
}

function prepareEdit(id){
    const p = products.find(p => p.id === id);
    document.getElementById('p-title').value = p.title;
    document.getElementById('p-price').value = p.price;
    document.getElementById('p-image').value = p.image;
    document.getElementById('p-category').value = p.category;

    editId = id;
    document.getElementById('add-btn').innerText = "Update Product";
    window.scrollTo(0, 0);
}

function handleSort() {
    const val = document.getElementById('sort-price').value;
    let sorted = [...products];
    if(val === 'low')
        sorted.sort((a,b) => a.price - b.price);
    dispalyProducts(sorted);
}

function handleFilter(){
    const cat = document.getElementById('filter-category').value;
    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    dispalyProducts(filtered);
}

function saveAndRefresh() {
    localStorage.setItem('products', JSON.stringify(products));
    dispalyProducts(products);
    updateCategoryFilter();
}

function clearInputs() {
    document.querySelectorAll('.input-group input').forEach(i => i.value = "");
}

function updateCategoryFilter(){
    const filterSelect = document.getElementById('filter-category');
    const categories = ['all', ...new Set(products.map(p => p.category))];

    filterSelect.innerHTML = categories
        .map(c => `<option value="${c}">${c}</option>`)
        .join('');
}