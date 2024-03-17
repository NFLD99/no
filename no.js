// ==UserScript==
// @name         No
// @namespace    http://tampermonkey.net/
// @version      4
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @updateURL    https://raw.githubusercontent.com/NFLD99/no/main/no.js
// @downloadURL  https://raw.githubusercontent.com/NFLD99/no/main/no.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the video ID is in the blacklist
    function isInBlacklist(videoId, blacklist) {
        return blacklist.includes(videoId);
    }

    // Extract video ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    // Function to retrieve the JSON blacklist and perform the necessary checks
    function checkBlacklist() {
        const timestamp = new Date().getTime(); // Generate a unique timestamp
        const url = `https://raw.githubusercontent.com/NFLD99/no/main/blacklist.json?_=${timestamp}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const blacklist = JSON.parse(response.responseText);
                        if (isInBlacklist(videoId, blacklist)) {
                            window.location.href = 'https://www.youtube.com/';
                        }
                    } catch (error) {
                        console.error("Error parsing blacklist JSON:", error);
                    }
                } else {
                    console.error("Failed to fetch blacklist:", response.statusText);
                }
            },
            onerror: function(error) {
                console.error("Error fetching blacklist:", error);
            }
        });
    }

    // Function to run script on DOM change
    function checkAndRunScript() {
        checkBlacklist();
    }

    // Observe DOM changes
    const observer = new MutationObserver(checkAndRunScript);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    // Call the function initially to check the blacklist
    checkAndRunScript();
})();
