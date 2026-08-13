const usernameInput = document.getElementById("usernameInput");
const searchButton = document.getElementById("searchButton");

const profileCard = document.getElementById("profileCard");
const errorElement = document.getElementById("error");


/* Search when button is clicked */

searchButton.addEventListener("click", searchUser);


/* Search when ENTER is pressed */

usernameInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        searchUser();
    }

});


async function searchUser() {

    const username = usernameInput.value.trim();

    errorElement.textContent = "";

    if (!username) {
        errorElement.textContent = "Enter a Roblox username.";
        return;
    }


    searchButton.disabled = true;
    searchButton.textContent = "Searching...";

    profileCard.classList.add("hidden");


    try {

        /*
         * Convert username → Roblox user ID
         */

        const userResponse = await fetch(
            "https://users.roblox.com/v1/usernames/users",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    usernames: [username],
                    excludeBannedUsers: false
                })
            }
        );


        if (!userResponse.ok) {
            throw new Error("Roblox API request failed.");
        }


        const userData = await userResponse.json();


        if (!userData.data || userData.data.length === 0) {
            throw new Error("Roblox user not found.");
        }


        const user = userData.data[0];

        const userId = user.id;


        /*
         * Get full profile information
         */

        const profileResponse = await fetch(
            `https://users.roblox.com/v1/users/${userId}`
        );


        if (!profileResponse.ok) {
            throw new Error("Couldn't retrieve profile.");
        }


        const profile = await profileResponse.json();


        /*
         * Avatar
         */

        const avatarResponse = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`
        );


        const avatarData = await avatarResponse.json();


        if (
            avatarData.data &&
            avatarData.data.length > 0
        ) {

            document.getElementById("avatar").src =
                avatarData.data[0].imageUrl;

        }


        /*
         * Basic information
         */

        document.getElementById("displayName").textContent =
            profile.displayName;

        document.getElementById("username").textContent =
            "@" + profile.name;

        document.getElementById("userId").textContent =
            profile.id;

        document.getElementById("description").textContent =
            profile.description || "No description.";


        /*
         * Account creation date
         */

        const createdDate = new Date(profile.created);

        document.getElementById("created").textContent =
            createdDate.toLocaleDateString(
                undefined,
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );


        /*
         * Account age
         */

        document.getElementById("accountAge").textContent =
            getAccountAge(createdDate);


        /*
         * Profile URL
         */

        const profileUrl =
            `https://www.roblox.com/users/${profile.id}/profile`;

        document.getElementById("profileUrl").value =
            profileUrl;

        document.getElementById("profileLink").href =
            profileUrl;


        /*
         * Get social counts
         */

        await getSocialStats(userId);


        /*
         * Show profile
         */

        profileCard.classList.remove("hidden");


    } catch (error) {

        console.error(error);

        errorElement.textContent =
            error.message || "Something went wrong.";

    }


    searchButton.disabled = false;
    searchButton.textContent = "Search";
}


/*
 * Get followers / following / friends
 */

async function getSocialStats(userId) {

    try {

        const [
            followersResponse,
            followingResponse,
            friendsResponse
        ] = await Promise.all([

            fetch(
                `https://friends.roblox.com/v1/users/${userId}/followers/count`
            ),

            fetch(
                `https://friends.roblox.com/v1/users/${userId}/followings/count`
            ),

            fetch(
                `https://friends.roblox.com/v1/users/${userId}/friends/count`
            )

        ]);


        const followers =
            await followersResponse.json();

        const following =
            await followingResponse.json();

        const friends =
            await friendsResponse.json();


        document.getElementById("followers").textContent =
            formatNumber(followers.count);


        document.getElementById("following").textContent =
            formatNumber(following.count);


        document.getElementById("friends").textContent =
            formatNumber(friends.count);


    } catch (error) {

        console.error(
            "Could not retrieve social stats:",
            error
        );

    }

}


/*
 * Account age calculator
 */

function getAccountAge(createdDate) {

    const now = new Date();

    let years =
        now.getFullYear() -
        createdDate.getFullYear();

    let months =
        now.getMonth() -
        createdDate.getMonth();

    let days =
        now.getDate() -
        createdDate.getDate();


    if (days < 0) {
        months--;
    }

    if (months < 0) {
        years--;
    }


    if (years > 0) {

        return `${years} year${years === 1 ? "" : "s"} old`;

    }


    const totalDays =
        Math.floor(
            (now - createdDate) /
            (1000 * 60 * 60 * 24)
        );


    return `${totalDays} days old`;
}


/*
 * Format large numbers
 */

function formatNumber(number) {

    if (number === undefined || number === null) {
        return "-";
    }

    return Number(number).toLocaleString();

}


/*
 * Clipboard buttons
 */

document.addEventListener("click", async function(event) {

    const button =
        event.target.closest(".copy-button");

    if (!button) {
        return;
    }


    const targetId =
        button.dataset.copy;

    const target =
        document.getElementById(targetId);


    if (!target) {
        return;
    }


    let text;


    if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"
    ) {

        text = target.value;

    } else {

        text = target.textContent;

    }


    try {

        await navigator.clipboard.writeText(text);


        const originalText =
            button.textContent;


        button.textContent =
            "Copied ✓";


        setTimeout(() => {

            button.textContent =
                originalText;

        }, 1500);


    } catch (error) {

        console.error(
            "Clipboard failed:",
            error
        );

        alert(
            "Your browser wouldn't allow clipboard access."
        );

    }

});