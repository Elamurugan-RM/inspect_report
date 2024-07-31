document.addEventListener('DOMContentLoaded', () => {
    fetch('3data.json')
        .then(response => response.json())
        .then(data => {
            window.reportsData = data.reports; // Store data globally for easy access
            displayReports(window.reportsData);
        })
        .catch(error => console.error('Error fetching the reports:', error));
});

function displayReports(reports) {
    const reportContainer = document.getElementById('report-container');
    reportContainer.innerHTML = '';

    reports.forEach(report => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // Create logo image
        const logoImg = document.createElement('img');
        logoImg.src = 'images/dashboard_logo.png'; // Standard image for report cards
        logoImg.alt = report.vehicleDetails.title;
        logoImg.classList.add('logo');
        cardDiv.appendChild(logoImg);

        // Display customer ID
        const customerId = document.createElement('p');
        customerId.textContent = `Customer ID: ${report.vehicleDetails.catCustomerId}`;
        cardDiv.appendChild(customerId);

        // Add click event listener to show components and vehicle details of the report
        cardDiv.addEventListener('click', () => {
            displayComponentsAndVehicleDetails(report);
        });

        // Create a download button
        const downloadBtn = document.createElement('button');
        downloadBtn.textContent = 'Download PDF';
        downloadBtn.classList.add('download-btn');

        // Add event listener to open PDF in a new tab
        downloadBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the card click event
            openPDF(report.vehicleDetails.catCustomerId);
        });

        cardDiv.appendChild(downloadBtn);

        reportContainer.appendChild(cardDiv);
    });

    // Show the report container and hide the component container initially
    document.getElementById('report-container').style.display = 'grid';
    document.getElementById('component-container').style.display = 'none';
}

function openPDF(customerId) {
    // Assuming your PDFs are stored in a folder named "pdfs" and named by customerId
    const pdfUrl = `report/CAT101_generated.pdf`; // Construct the URL to the PDF file
    window.open(pdfUrl, '_blank'); // Open the PDF in a new tab
}

function displayComponentsAndVehicleDetails(report) {
    const componentContainer = document.getElementById('component-container');
    componentContainer.innerHTML = '';

    // Create back button as a card with a logo
    const backCardDiv = document.createElement('div');
    backCardDiv.classList.add('card');

    const backLogoImg = document.createElement('img');
    backLogoImg.src = 'images/back_logo.png'; // Path to your back button logo
    backLogoImg.alt = 'Back to Reports';
    backLogoImg.classList.add('logo');
    backCardDiv.appendChild(backLogoImg);

    const backTitle = document.createElement('h2');
    backTitle.textContent = 'Back to Reports';
    backCardDiv.appendChild(backTitle);

    backCardDiv.addEventListener('click', () => {
        displayReports(window.reportsData);
    });
    componentContainer.appendChild(backCardDiv);

    // Display vehicle details card
    const vehicleCard = document.createElement('div');
    vehicleCard.classList.add('card');
    vehicleCard.style.cursor = 'pointer'; // Add pointer cursor for clickability

    // Create logo image for vehicle (clickable)
    const vehicleLogoImg = document.createElement('img');
    vehicleLogoImg.src = 'images/vehicle_logo.png'; // Example vehicle logo image
    vehicleLogoImg.alt = 'Vehicle Logo';
    vehicleLogoImg.classList.add('logo');
    vehicleCard.appendChild(vehicleLogoImg);

    // Display vehicle model (clickable)
    const vehicleTitle = document.createElement('h2');
    vehicleTitle.textContent = report.vehicleDetails.truckModel;
    vehicleCard.appendChild(vehicleTitle);

    // Add click event listener to show vehicle details in modal
    vehicleCard.addEventListener('click', () => {
        showModalVehicleDetails(report);
    });

    componentContainer.appendChild(vehicleCard);

    // Display components
    report.components.forEach(component => {
        const componentCard = document.createElement('div');
        componentCard.classList.add('component-card');

        // Create logo image for the component
        const logoImg = document.createElement('img');
        logoImg.src = component.logo;
        logoImg.alt = component.name + ' Logo';
        logoImg.classList.add('component-logo');
        componentCard.appendChild(logoImg);

        // Create component name heading
        const componentName = document.createElement('h3');
        componentName.textContent = component.name;
        componentCard.appendChild(componentName);

        // Add click event listener to show detailed component information
        componentCard.addEventListener('click', () => {
            showModal(component);
        });

        componentContainer.appendChild(componentCard);
    });

    // Show the component container and hide the report container
    document.getElementById('report-container').style.display = 'none';
    document.getElementById('component-container').style.display = 'grid';
}

function showModalVehicleDetails(report) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <img src="images/dashboard_logo.png" alt="${report.vehicleDetails.title}" class="logo">
            <h2>${report.vehicleDetails.truckModel}</h2>
            <span class="close">&times;</span>
        </div>
        <div class="modal-body">
            <p><strong>Customer/Company Name:</strong> ${report.title}</p>
            <p><strong>Serial Number:</strong> ${report.vehicleDetails.truckSerialNumber}</p>
            <p><strong>Inspector Name:</strong> ${report.inspectorName}</p>
            <p><strong>Inspection Date & Time:</strong> ${report.inspectionDateTime}</p>
            <p><strong>Location of Inspection:</strong> ${report.locationOfInspection}</p>
            <p><strong>Service Meter Hours:</strong> ${report.serviceMeterHours}</p>
        </div>
    `;
    
    modal.style.display = 'block';

    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showModal(component) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <h2>${component.name}</h2>
        <div class="details-modal">
            ${Object.entries(component.attributes).map(([key, value]) => `
                <p><strong>${key}:</strong> ${value}</p>
            `).join('')}
            ${component.images.length > 0 ? `
                <div class="images-container-modal">
                    ${component.images.map(image => `
                        <img src="${image.imageName}" alt="${image.imageDescription}">
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    modal.style.display = 'block';

    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}
