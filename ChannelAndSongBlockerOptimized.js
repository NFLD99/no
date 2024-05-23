// ==UserScript==
// @name         Channel & Song Blocker Optimized
// @namespace    http://tampermonkey.net/
// @version      2
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_xmlhttpRequest
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    const remoteFileUrl = 'https://raw.githubusercontent.com/NFLD99/no/main/skipMe.json';
    const githubApiUrl = 'https://api.github.com/repos/NFLD99/no/contents/skipMe.json';
    const githubToken = 'FILL ME WITH TOKEN';
    const toxicSongs = [
        'Prompto - Eternal',
    ];
    let toxicLinks = [];
    function makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    async function fetchToxicLinks() {
        try {
            const response = await fetch(`${remoteFileUrl}?t=${makeid(5)}`);
            toxicLinks = await response.json();
            console.log("Fetched toxic links:", toxicLinks);
        } catch (error) {
            console.error('Error fetching toxic links:', error);
            toxicLinks = [];
        }
    }
    function blockToxicContent() {
        setInterval(() => {
            toxicLinks.forEach(link => {
                const toxicLink = document.querySelector(link);
                if (toxicLink) {
                    document.querySelector(".ytp-next-button").click();
                }
            });
            const videoTitle = document.querySelector("#container > h1 > yt-formatted-string").innerText;
            toxicSongs.forEach(word => {
                if (videoTitle.includes(word)) {
                    document.querySelector(".ytp-next-button").click();
                }
            });
        }, 5000);
    }
    function addToxicLink(newLink, callback) {
        toxicLinks.push(newLink);
        updateRemoteFile(toxicLinks, callback);
    }
    function updateRemoteFile(links, callback) {
        fetch(githubApiUrl, {
            headers: {
                'Authorization': 'token ' + githubToken
            }
        })
        .then(response => response.json())
        .then(data => {
            const sha = data.sha;
            fetch(githubApiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': 'token ' + githubToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update toxic links',
                    content: btoa(JSON.stringify(links, null, 2)),
                    sha: sha
                })
            })
            .then(response => {
                if (response.ok) {
                    callback();
                } else {
                    console.error('Failed to update file', response);
                }
            });
        });
    }
    function createAddLinkButton() {
        const ownerElement = document.querySelector("#logo");
        if (ownerElement && !document.getElementById('addLinkButton')) {
            const button = document.createElement('button');
            button.id = 'addLinkButton';
            button.innerText = 'Block Channel';
            button.style.cssText = 'background: #272728; color: #f1f1f1; border-radius: 50px;';
            button.classList.add('glow-on-hover');
            button.addEventListener('click', () => {
                let newLink = document.querySelector('.yt-simple-endpoint.style-scope.yt-formatted-string').getAttribute("href");
                if (newLink) {
                    newLink = `[href='${newLink}']`;
                    addToxicLink(newLink, () => {
                        alert('Link added successfully!');
                    });
                }
            });
            ownerElement.parentNode.insertBefore(button, ownerElement.nextSibling);
        }
    }
    function addScript() {
        createAddLinkButton();
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    createAddLinkButton();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener("DOMContentLoaded", () => {
        fetchToxicLinks().then(blockToxicContent);
        addScript();
    });
    window.addEventListener("load", addScript);
    window.addEventListener("popstate", addScript);
    window.addEventListener("hashchange", addScript);
})();
