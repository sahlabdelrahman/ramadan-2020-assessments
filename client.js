document.addEventListener("DOMContentLoaded", () => {
    const serverUrl = "http://localhost:7777";

    const updateVote = async ({ id, vote_type }) => {
        let score;
        await fetch(`${serverUrl}/video-request/vote`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                id,
                vote_type,
            }),
        })
            .then((blob) => blob.json())
            .then((votes) => {
                score = +votes?.ups - +votes?.downs;
            });

        return score;
    };
    const getSingleVideoRequest = ({
        _id,
        topic_title,
        topic_details,
        author_name,
        expected_result,
        target_level,
        status,
        submit_date,
        votes,
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
                                ${
                                    expected_result &&
                                    `<p class="mb-0 text-muted">
                                    <strong>Expected results:</strong> ${expected_result}
                                </p>`
                                }
                            </div>
                            <div class="d-flex flex-column text-center">
                                <a class="btn btn-link" id="vote_ups_${_id}">🔺</a>
                                <h3 id="vote_scores_${_id}">${
            votes?.ups - votes?.downs
        }</h3>
                                <a class="btn btn-link" id="vote_downs_${_id}">🔻</a>
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

    const getVideoRequests = () => {
        fetch(`${serverUrl}/video-request`)
            .then((blob) => blob.json())
            .then((data) => {
                data.forEach((videoInfo) => {
                    listOfRequestsEl.appendChild(
                        getSingleVideoRequest(videoInfo)
                    );

                    const id = videoInfo?._id;

                    const voteUpsEl = document.getElementById(`vote_ups_${id}`);
                    const voteDownsEl = document.getElementById(
                        `vote_downs_${id}`
                    );
                    const voteScoresEl = document.getElementById(
                        `vote_scores_${id}`
                    );

                    voteUpsEl.addEventListener("click", async () => {
                        updateVote({
                            id,
                            vote_type: "ups",
                        }).then((score) => {
                            voteScoresEl.innerHTML = score;
                        });
                    });
                    voteDownsEl.addEventListener("click", async () => {
                        updateVote({
                            id,
                            vote_type: "downs",
                        }).then((score) => {
                            voteScoresEl.innerHTML = score;
                        });
                    });
                });
            });
    };

    getVideoRequests();

    formVideoRequestEl.addEventListener("submit", (e) => {
        e.preventDefault();

        const fromData = new FormData(formVideoRequestEl);

        fetch(`${serverUrl}/video-request`, {
            method: "POST",
            body: fromData,
        })
            .then((blob) => blob.json())
            .then((data) => {
                listOfRequestsEl.prepend(getSingleVideoRequest(data));
            });
    });
});
