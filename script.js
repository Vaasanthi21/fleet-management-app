let fleetData = [];


document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    
    const addFleetForm = document.getElementById('addFleetForm');
    if (addFleetForm) {
       
        addFleetForm.addEventListener('submit', handleAddFleet);
        
       
        loadFleetData();

       
        document.getElementById('categoryFilter').addEventListener('change', renderFleetCards);
        document.getElementById('availabilityFilter').addEventListener('change', renderFleetCards);
        document.getElementById('clearFilterBtn').addEventListener('click', clearFilters);
    }
});

function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;

   
    const VALID_EMAIL = 'admin@gmail.com';
    const VALID_PASSWORD = 'admin1234';

    if (emailInput === VALID_EMAIL && passwordInput === VALID_PASSWORD) {
        alert('login success');
        window.location.href = 'admin.html'; 
    } else {
        alert('Wrong email or password');
    }
}




function handleAddFleet(event) {
    event.preventDefault();

    const regNo = document.getElementById('regNo').value.trim();
    const category = document.getElementById('category').value;
    const driverName = document.getElementById('driverName').value.trim();
    const isAvailable = document.getElementById('isAvailable').value;
    
    
    if (!regNo || !category || !driverName || !isAvailable) {
        alert('Error: All fields are required.');
        return;
    }

    const newVehicle = {
        regNo: regNo,
        category: category,
        driverName: driverName,
        availability: isAvailable,
        id: Date.now() 
    };

    fleetData.push(newVehicle);
    saveFleetData(); 
    renderFleetCards(); 
    
    document.getElementById('addFleetForm').reset();
}

function renderFleetCards() {
    const container = document.getElementById('fleetCardsContainer');
    container.innerHTML = '';
   
    const categoryFilter = document.getElementById('categoryFilter').value;
    const availabilityFilter = document.getElementById('availabilityFilter').value;

    
    const filteredData = fleetData.filter(vehicle => {
        const categoryMatch = categoryFilter === 'All' || vehicle.category === categoryFilter;
        const availabilityMatch = availabilityFilter === 'All' || vehicle.availability === availabilityFilter;
        return categoryMatch && availabilityMatch;
    });

    if (filteredData.length === 0) {
        container.innerHTML = '<p class="no-data">No vehicles match the current filter criteria.</p>';
        return;
    }

    filteredData.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'fleet-card ${vehicle.availability.toLowerCase()}';
        card.dataset.id = vehicle.id;

        
        const imageSrc = 'https://picsum.photos/400/200?random=' + vehicle.id; 

        card.innerHTML = `
            <img src="${imageSrc}" alt="${vehicle.category}" class="vehicle-image">
            <div class="card-content">
                <p><strong>Reg No:</strong> ${vehicle.regNo}</p>
                <p><strong>Category:</strong> ${vehicle.category}</p>
                <p><strong>Driver:</strong> <span id="driver-${vehicle.id}">${vehicle.driverName}</span></p>
                <p><strong>Status:</strong> <span class="availability-status" id="status-${vehicle.id}">${vehicle.availability}</span></p>
                
                <div class="card-actions">
                    <button onclick="updateDriver(${vehicle.id})">Update Driver</button>
                    <button onclick="toggleAvailability(${vehicle.id})">Change Availability</button>
                    <button onclick="deleteVehicle(${vehicle.id})">Delete Vehicle</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function clearFilters() {
    document.getElementById('categoryFilter').value = 'All';
    document.getElementById('availabilityFilter').value = 'All';
    renderFleetCards();
}

function updateDriver(id) {
    const newDriverName = prompt("Enter and Update Driver Name:");

    
    if (newDriverName === null) {
        return; 
    }

    const trimmedName = newDriverName.trim();
    if (trimmedName === '') {
        alert("Driver name cannot be empty.");
        return;
    }

    const vehicleIndex = fleetData.findIndex(v => v.id === id);
    if (vehicleIndex !== -1) {
        fleetData[vehicleIndex].driverName = trimmedName;
        saveFleetData();
        
        document.getElementById('driver-${id}').textContent = trimmedName;
    }
}

function toggleAvailability(id) {
    const vehicleIndex = fleetData.findIndex(v => v.id === id);
    if (vehicleIndex !== -1) {
        const currentStatus = fleetData[vehicleIndex].availability;
        const newStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
        
        fleetData[vehicleIndex].availability = newStatus;
        saveFleetData();

       
        const statusSpan = document.getElementById('status-${id}');
        statusSpan.textContent = newStatus;
        
        
        const cardElement = statusSpan.closest('.fleet-card');
        cardElement.classList.remove(currentStatus.toLowerCase());
        cardElement.classList.add(newStatus.toLowerCase());
    }
}

function deleteVehicle(id) {
    
    const isConfirmed = confirm("Are you sure you want to delete this vehicle?");
    
    if (isConfirmed) {
        fleetData = fleetData.filter(v => v.id !== id);
        saveFleetData();
        renderFleetCards(); 
    }
}



function saveFleetData() {
    localStorage.setItem('fleetData', JSON.stringify(fleetData));
}

function loadFleetData() {
    const savedData = localStorage.getItem('fleetData');
    if (savedData) {
        fleetData = JSON.parse(savedData);
    }
    renderFleetCards();
}