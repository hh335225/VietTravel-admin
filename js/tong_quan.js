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

    function formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
        if (diffMinutes < 1) {
            return "Vừa xong";
        } else if (diffHours < 1) {
            return `${diffMinutes} phút trước`;
        } else if (diffDays < 1) {
            return `${diffHours} giờ trước`;
        } else if (diffDays <= 2) {
            return `${diffDays} ngày trước`;
        } else {
            const options = { day: 'numeric', month: 'short' };
            return new Date(date).toLocaleDateString('vi-VN', options);
        }
    }

    const userTableBody = document.getElementById('user-table-body');
    const currentDate = new Date();

    try {
        const response = await fetch('http://localhost:3000/api/users/all-users');
        const users = await response.json();

        // Lọc người dùng đăng ký trong vòng 2 ngày gần đây
        const recentUsers = users.filter(user => {
            const registrationDate = user.registrationDate ? new Date(user.registrationDate) : new Date(0); // ngày 1 tháng 1 năm 1970
            const timeDifference = currentDate - registrationDate;
            const daysDifference = timeDifference / (1000 * 3600);
            console.log(currentDate, user.registrationDate, registrationDate, daysDifference);
            return daysDifference <= 2;
        });

        recentUsers.reverse();

        // Hiển thị người dùng trong bảng
        recentUsers.forEach(user => {
            const tr = document.createElement('tr');
            const userAvatar = user.avatar ? user.avatar : '/img/user-icon.png'; // Đường dẫn đến biểu tượng người dùng mặc định
            const registrationDate = formatTimeAgo(user.registrationDate);
            tr.innerHTML = `
                        <td>
                            <img src="${userAvatar}" alt="${user.username}">
                            <p>${user.username}</p>
                        </td>
                        <td>${registrationDate}</td>
                    `;
            userTableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});
