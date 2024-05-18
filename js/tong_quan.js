document.addEventListener('DOMContentLoaded', async () => {
    const totalHistoricalSitesElement = document.getElementById('total-historical-sites');
    const totalUsersElement = document.getElementById('total-users');

    // Hàm để lấy dữ liệu từ API
    async function fetchData(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Hàm để hiển thị tổng số lượng di tích hoặc người dùng
    function displayTotalCount(element, count) {
        element.textContent = count;
    }

    // Load và hiển thị dữ liệu khi trang được tải
    async function loadAndDisplayData() {
        const historicalSites = await fetchData('http://localhost:3000/api/historicalSites/all-historical-sites');
        const users = await fetchData('http://localhost:3000/api/users/all-users');

        displayTotalCount(totalHistoricalSitesElement, historicalSites.length);
        displayTotalCount(totalUsersElement, users.length);
    }

    loadAndDisplayData();
});
