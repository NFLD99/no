// ==UserScript==
// @name         No
// @namespace    http://tampermonkey.net/
// @version      2
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

    // Function to run script on audio play
    function checkAndRunScript() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const gainNode = audioContext.createGain();
        const oscillator = audioContext.createOscillator();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(0);

        // Check if audio is being played
        setTimeout(() => {
            if (audioContext.state === 'running') {
                checkBlacklist();
            }
            audioContext.close();
        }, 1000); // Adjust this timeout if needed
    }

    // Call the function to check and run script
    checkAndRunScript();

    // Listen for URL changes
    window.addEventListener("hashchange", checkAndRunScript);
})();
