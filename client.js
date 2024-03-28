document.addEventListener("DOMContentLoaded", () => {
    const getSingleVideoRequest = ({
        topic_title,
        topic_details,
        author_name,
        expected_result,
        target_level,
        status,
        submit_date,
    }) => {
        const videoContainerEl = document.createElement("div");
        videoContainerEl.classList.add("card", "mb-3");
        videoContainerEl.innerHTML = `
                        <div
                            class="card-body d-flex justify-content-between flex-row"
                        >
                            <div class="d-flex flex-column">
                                <h3>${topic_title}</h3>
                                <p class="text-muted mb-2">${topic_details}</p>
                                <p class="mb-0 text-muted">
                                    <strong>${expected_result}:</strong> ${topic_details}
                                </p>
                            </div>
                            <div class="d-flex flex-column text-center">
                                <a class="btn btn-link">🔺</a>
                                <h3>0</h3>
                                <a class="btn btn-link">🔻</a>
                            </div>
                        </div>
                        <div
                            class="card-footer d-flex flex-row justify-content-between"
                        >
                            <div>
                                <span class="text-info">${status.toUpperCase()}</span>
                                &bullet; added by <strong>${author_name}</strong> on
                                <strong>${new Date(
                                    submit_date
                                ).toLocaleDateString()}</strong>
                            </div>
                            <div
                                class="d-flex justify-content-center flex-column 408ml-auto mr-2"
                            >
                                <div class="badge badge-success">${target_level}</div>
                            </div>
                        </div>
                `;

        return videoContainerEl;
    };

    const formVideoRequestEl = document.getElementById("formVideoRequest");
    const listOfRequestsEl = document.getElementById("listOfRequests");

    fetch("http://localhost:7777/video-request")
        .then((blob) => blob.json())
        .then((data) => {
            data.forEach((videoInfo) => {
                listOfRequestsEl.appendChild(getSingleVideoRequest(videoInfo));
            });
        });

    formVideoRequestEl.addEventListener("submit", (e) => {
        e.preventDefault();

        const fromData = new FormData(formVideoRequestEl);

        fetch("http://localhost:7777/video-request", {
            method: "POST",
            body: fromData,
        })
            .then((blob) => blob.json())
            .then((data) => {
                console.log("data: " + data);
            });
    });
});
