document.addEventListener('DOMContentLoaded', () => {
    // Lấy tbody của bảng
    const tableBody = document.getElementById('user-table-body');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    let users = [];

    // Hàm để lấy dữ liệu từ API và thêm vào bảng
    async function fetchAndDisplayUsers() {
        try {
            const response = await fetch('http://localhost:3000/api/users/all-users');
            users = await response.json();
            users.sort((a, b) => {
                const usernameA = a.username.toLowerCase();
                const usernameB = b.username.toLowerCase();
                if (usernameA < usernameB) {
                    return -1;
                }
                if (usernameA > usernameB) {
                    return 1;
                }
                return 0;
            });
            displayUsers(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Hàm để hiển thị người dùng trong bảng
    async function displayUsers(users) {
        // Xóa nội dung hiện tại của bảng
        tableBody.innerHTML = '';

        // Duyệt qua mỗi người dùng và thêm hàng vào bảng
        users.forEach(user => {
            const tr = document.createElement('tr');
            const userAvatar = user.avatar ? user.avatar : '/img/user-icon.png'; // Đường dẫn đến biểu tượng người dùng mặc định
        
            tr.innerHTML = `
                <td>
                    <img src="${userAvatar}" alt="User Image">
                    <p>${user.username}</p>
                </td>
                <td>${user.userId}</td>
                <td>0${user.numberPhone}</td>
                <td>${user.email}</td>
            `;
            //<td>${new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toLocaleDateString()}</td>
        
            tableBody.appendChild(tr);
        });
        
    }

    // Hàm để tìm kiếm và lọc người dùng
    function searchUsers(query) {
        const lowerCaseQuery = query.toLowerCase();
        const filteredUsers = users.filter(user => {
            return (
                user.username.toLowerCase().includes(lowerCaseQuery) ||
                ('0' + user.numberPhone.toString() == lowerCaseQuery) ||
                user.email.toLowerCase().includes(lowerCaseQuery)
            );
        });
        displayUsers(filteredUsers);
    }

    // Sự kiện submit form tìm kiếm
    searchForm.addEventListener('click', (event) => {
        event.preventDefault();
        const query = searchInput.value;
        searchUsers(query);
    });

    // Gọi hàm để lấy và hiển thị người dùng khi trang được tải
    fetchAndDisplayUsers();
});
