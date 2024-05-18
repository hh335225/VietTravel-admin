document.addEventListener('DOMContentLoaded', async () => {
    const historicalSitesBody = document.querySelector('.historical-sites-body');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const cancelEdit = document.getElementById('cancelEdit');
    let historicalSites = [];
    let currentEditSiteId = null;

    async function fetchHistoricalSites() {
        try {
            const response = await fetch('http://localhost:3000/api/historicalSites/all-historical-sites');
            historicalSites = await response.json();
            displayHistoricalSites(historicalSites);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayHistoricalSites(sites) {
        historicalSitesBody.innerHTML = '';
        sites.forEach(site => {
            const tr = document.createElement('tr');
            const firstImage = site.images[0].length !== 0 ? site.images[0] : '/img/image.png';
            console.log(firstImage);
            tr.innerHTML = `
                <td style="max-width:170px; display:block; align-items:center;">
                    <img src="${firstImage}" alt="${site.name}">
                    <span style="font-size: 1.1em">${site.name}</span>
                </td>
                <td style="max-width:175px">${site.historySiteId}</td>
                <td style="max-width: 150px;">${site.summary}</td>
                <td style="max-width: 400px;">${site.description}</td>
                <td style="max-width: 120px;">
                    <span>X = ${site.location.x}<br>Y = ${site.location.y}</span>
                </td>
                <td style="max-width: 50px;">
                    <i class='bx bx-pencil edit-icon' onclick="showEditForm('${site.historySiteId}')"></i>
                    <i class='bx bx-trash delete-icon' onclick="showModal('${site.historySiteId}')"></i>
                </td>
            `;
            historicalSitesBody.appendChild(tr);
        });
    }

    function searchHistoricalSites() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredSites = historicalSites.filter(site =>
            site.name.toLowerCase().includes(searchTerm) ||
            site.historySiteId.toLowerCase().includes(searchTerm) ||
            site.summary.toLowerCase().includes(searchTerm) ||
            site.description.toLowerCase().includes(searchTerm)
        );
        displayHistoricalSites(filteredSites);
    }

    searchForm.addEventListener('click', (event) => {
        event.preventDefault();
        searchHistoricalSites();
    });

    fetchHistoricalSites();

    const confirmDelete = document.querySelector(".btn-confirm");
    confirmDelete.addEventListener('click', async () => {
        console.log("delete");

        try {
            const response = await fetch("http://localhost:3000/api/historicalSites/delete-historical-site/" + confirmDelete.dataset.id, {
                method: 'DELETE'
            });
            console.log("delete");

            if (response.ok) {
                hideModal();
                window.location.reload();
            } else {
                const error = await response.json();
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi xóa di tích. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xóa di tích. Vui lòng thử lại.');
        }
    });

    window.showEditForm = (historySiteId) => {
        const site = historicalSites.find(s => s.historySiteId === historySiteId);
        if (site) {
            currentEditSiteId = site.historySiteId;
            document.getElementById('editName').value = site.name;
            document.getElementById('editHistorySiteId').value = site.historySiteId;
            document.getElementById('editSummary').value = site.summary;
            document.getElementById('editDescription').value = site.description;
            document.getElementById('editImage').value = site.images.length > 0 ? site.images[0] : '';
            document.getElementById('editX').value = site.location.x;
            document.getElementById('editY').value = site.location.y;
            editModal.style.display = 'block';
        }
    };

    function hideEditForm() {
        editModal.style.display = "none";
    };

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedSite = {
            name: document.getElementById('editName').value,
            summary: document.getElementById('editSummary').value,
            description: document.getElementById('editDescription').value,
            images: [document.getElementById('editImage').value],
            location: {
                x: parseFloat(document.getElementById('editX').value),
                y: parseFloat(document.getElementById('editY').value)
            }
        };
        console.log(JSON.stringify(updatedSite));

        try {
            const response = await fetch(`http://localhost:3000/api/historicalSites/update-historical-site/${currentEditSiteId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedSite)
            });

            if (response.ok) {
                fetchHistoricalSites();
                hideEditForm();
            } else {
                console.error('Error updating site');
            }
        } catch (error) {
            console.error('Error updating site:', error);
        }
    });

    cancelEdit.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    const addForm = document.getElementById('addModal');
    function hideAddForm() {
        addForm.style.display = "none";
    }
    function showAddForm() {
        addForm.style.display = "block";
    }


    const add_historical_site = document.querySelector("#add-historical-site");
    add_historical_site.addEventListener('click', () => {
        showAddForm();
    })

    document.getElementById('cancelAdd').addEventListener('click', () => {
        hideAddForm();
    })


    addForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = {
            name: document.getElementById('name').value,
            summary: document.getElementById('summary').value,
            description: document.getElementById('description').value,
            images: [document.getElementById('image').value],
            location: {
                x: parseFloat(document.getElementById('location-x').value),
                y: parseFloat(document.getElementById('location-y').value)

            }
        };
        // console.log(JSON.stringify(formData));

        try {
            const response = await fetch('http://localhost:3000/api/historicalSites/add-historical-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchHistoricalSites();
                hideAddForm();
                console.log('Thêm di tích thành công!');
            } else {
                // Xử lý lỗi
                console.error('Lỗi khi thêm di tích:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi khi thêm di tích:', error);
        }
    });

});
