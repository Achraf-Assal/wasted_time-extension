
const time = document.getElementById("time");
const currentTab = document.getElementById("current");

// chrome.runtime.sendMessage({ action: "getTime" }, (response) => {
//     time.textContent = response.time;
//     console.log("Time spent on YouTube:", response.time, "seconds");
//   });

chrome.runtime.sendMessage({ action: "currentTab" }, (response) => {
    if (response) {
        const domain = new URL(response).hostname;
        const mainDomain = domain.replace(/^www\./, "").split(".")[0];
        currentTab.textContent = mainDomain;
    } else {
        console.log("Current tab is not YouTube");
    }
});