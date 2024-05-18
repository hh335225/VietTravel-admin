document.addEventListener('DOMContentLoaded', async () => {
    const commentsBody = document.querySelector('#comments-tbody');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');

    let comments = [];

    async function fetchComments() {
        try {
            const response = await fetch('http://localhost:3000/api/comments/all-comments'); // Đường dẫn tới API JSON của các di tích cổ
            comments = await response.json();

            displayComments(comments);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayComments(comments) {
        commentsBody.innerHTML = '';
        for (let i = comments.length - 1; i >= 0; i--) {
            var comment = comments[i];
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>
                <img src="${comment.userAvatar}" alt="${comment.username}">
                <p>${comment.username}</p>
            </td>
            <td>${comment.historicalSiteName}</td>
            <td>${comment.content}</td>
            <td>${comment.time}</td>
            <td><i class='bx bx-trash delete-icon' onclick="showModal('${comment.commentId}')"></i></td>
            `;
            commentsBody.appendChild(tr);
        };
    }

    function searchComments() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredcomments = comments.filter(comment =>
            comment.username.toLowerCase().includes(searchTerm) ||
            comment.historicalSiteName.toLowerCase().includes(searchTerm) ||
            comment.time.toLowerCase().includes(searchTerm)
        );
        displayComments(filteredcomments);
    }

    searchForm.addEventListener('click', (event) => {
        event.preventDefault();
        searchComments();
    });

    fetchComments();

    const confirmDelete = document.querySelector(".btn-confirm");
    confirmDelete.addEventListener('click', async () => {
        console.log("delete");

        try {
            const response = await fetch("http://localhost:3000/api/comments/delete-comment/" + confirmDelete.dataset.id, {
                method: 'DELETE'
            });
            console.log("delete");

            if (response.ok) {
                hideModal();
                window.location.reload();
            } else {
                const error = await response.json();
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi xóa bình luận. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi xóa bình luận. Vui lòng thử lại.');
        }
    });

});

