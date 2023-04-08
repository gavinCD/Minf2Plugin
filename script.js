console.log("A plugin to remind users of privacy policies");

document.getElementById("currSiteTabButton").addEventListener("click", openCurrentSiteTab);
document.getElementById("moreInfoTabButton").addEventListener("click", openMoreInfoTab);
document.getElementById("settingsTabButton").addEventListener("click", openSettingsTab);

document.getElementById("goodTosdrButton").addEventListener("click",showGoodTab);
document.getElementById("badTosdrButton").addEventListener("click",showBadTab);


const cookie_setting = document.getElementById("cookie_setting");
cookie_setting.addEventListener("mouseover",describeCookies);
cookie_setting.addEventListener("mouseleave",clearDescription);
cookie_setting.addEventListener("click",changeSettings);

const personalisation_setting = document.getElementById("personalisation_setting");
personalisation_setting.addEventListener("mouseover",describePersonalisation);
personalisation_setting.addEventListener("mouseleave",clearDescription);
personalisation_setting.addEventListener("click",changeSettings);

const data_sharing_setting = document.getElementById("data_sharing_setting");
data_sharing_setting.addEventListener("mouseover",describeDataSharing);
data_sharing_setting.addEventListener("mouseleave",clearDescription);
data_sharing_setting.addEventListener("click",changeSettings);

const tracking_setting = document.getElementById("tracking_setting");
tracking_setting.addEventListener("mouseover",describeTracking);
tracking_setting.addEventListener("mouseleave",clearDescription);
tracking_setting.addEventListener("click",changeSettings);

const communication_setting = document.getElementById("communication_setting");
communication_setting.addEventListener("mouseover",describeCommunication);
communication_setting.addEventListener("mouseleave",clearDescription);
communication_setting.addEventListener("click",changeSettings);

const data_visibility_setting = document.getElementById("data_visibility_setting");
data_visibility_setting.addEventListener("mouseover",describeVisibility);
data_visibility_setting.addEventListener("mouseleave",clearDescription);
data_visibility_setting.addEventListener("click",changeSettings);

const history_setting = document.getElementById("history_setting");
history_setting.addEventListener("mouseover",describeHistory);
history_setting.addEventListener("mouseleave",clearDescription);
history_setting.addEventListener("click",changeSettings);

const opt_out_setting = document.getElementById("optOut_setting");
opt_out_setting.addEventListener("mouseover",describeOptOut);
opt_out_setting.addEventListener("mouseleave",clearDescription);
opt_out_setting.addEventListener("click",changeSettings);


let currSiteTab = document.getElementById("currSiteTab");
let moreInfoTab = document.getElementById("moreInfoTab");
let settingsTab = document.getElementById("settingsTab");

let goodTab = document.getElementById("goodTosdrButton");
let badTab = document.getElementById("badTosdrButton");

const subdomains = ['www', 'mail', 'ftp', 'localhost', 'webmail', 'smtp', 'pop', 'ns1', 'webdisk', 'ns2', 'cpanel', 'whm', 'autodiscover', 'autoconfig', 'm', 'imap', 'test', 'ns', 'blog', 'pop3', 'dev', 'www2', 'admin', 'forum', 'news', 'vpn', 'ns3', 'mail2', 'new', 'mysql', 'old', 'lists', 'support', 'mobile', 'mx', 'static', 'docs', 'beta', 'shop', 'sql', 'secure', 'demo', 'cp', 'calendar', 'wiki', 'web', 'media', 'email', 'images', 'img', 'www1', 'intranet', 'portal', 'video', 'sip', 'dns2', 'api', 'cdn', 'stats', 'dns1', 'ns4', 'www3', 'dns', 'search', 'staging', 'server', 'mx1', 'chat', 'wap', 'my', 'svn', 'mail1', 'sites', 'proxy', 'ads', 'host', 'crm', 'cms', 'backup', 'mx2', 'lyncdiscover', 'info', 'apps', 'download', 'remote', 'db', 'forums', 'store', 'relay', 'files', 'newsletter', 'app', 'live', 'owa', 'en', 'start', 'sms', 'office', 'exchange', 'ipv4', "open"];
const tlds = ['com', 'net', 'org', 'de', 'icu', 'uk', 'ru', 'info', 'top', 'xyz', 'tk', 'cn', 'ga', 'cf', 'nl', 'gov', 'co', "ac"];



let tabs = [currSiteTab, moreInfoTab, settingsTab];
//get current tab from chrome storage
let current_tab = "";


//opens on last opened tab
chrome.storage.local.get(["currentTab"]).then((result) => {
    current_tab = result.currentTab;
    console.log("got result of: ", result.currentTab);
    switch (current_tab) {
        case "currSiteTab":
            openCurrentSiteTab();
            break;
        case "moreInfoTab":
            openMoreInfoTab();
            break;
        case "settingsTab":
            openSettingsTab();
            break;
    }
});



function openCurrentSiteTab() {
    switchToTab(currSiteTab);
    displayCurrentURL();
    //display tosdr img
    //https://shields.tosdr.org/en_service.jpg


}

function openMoreInfoTab() {
    switchToTab(moreInfoTab);
    console.log("opening more info");
    console.log("Fetching more info tab");
    displayMoreInfo();
}



function openSettingsTab() {
    switchToTab(settingsTab);

    setSettingButtonsToSavedValues();
    console.log("opening settings tab");
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function displayMoreInfo(){
    console.log("----------------------------------------------------------------------");
    let tab = await getCurrentTab();
    let url = tab.url;
    url = url.split("://")[1].split("/")[0];
    url = remove_subdomains_and_tlds(url);

    //Check if info has already been fetched
    let json_data;
    let last_site = await getLastFetchedSiteInfo();
    console.log("Last Site: " + last_site)
    // if(url === last_site){
    //     console.log("CACHE HIT!");
    //     json_data = await getLastFetchedInfoJSON();
    // }else{
    //     console.log("CACHE MISS!");
    //     console.log("URL: " + url);
    //     json_data = await getInfoJsonForSite(url);
    //     setLastFetchedInfoJSON(url,json_data);
    // }
    clear_info_card();
    let info_box_div = document.getElementById("siteInfoBoxes");

    json_data = await getInfoJsonForSite(url);
    json_data.forEach(element => create_info_card(info_box_div,element));
    console.log("----------------------------------------------------------------------");
}

async function displayCurrentURL() {
    console.log("######################################################################################");
    //set header to current url
    let label = document.getElementById("curr_site");
    let tab = await getCurrentTab();
    let url = tab.url;
    //first split between :// and the first /
    url = url.split("://")[1].split("/")[0];
    //this works!!!
    let no_sub_url = remove_subdomains(url);
    let service_name = remove_subdomains_and_tlds(url);

    label.innerHTML = no_sub_url;
    let img_link = await get_priv_shield(service_name);
    document.getElementById("privacy_shield").src = img_link;
    console.log("set img to", img_link);

    //get from cache if site hasn't changed
    //chrome.local.storage.get
    let json_data;
    let last_site = await getLastFetchedSiteTosdr();
    console.log("Last fetched site: " + last_site);
    if(no_sub_url === last_site){
        print("matches!")
        json_data = await getLastFetchedTosdrJSON(no_sub_url);
    }else{
        json_data = await getTosdrJsonForSite(no_sub_url);
        console.log(json_data);
        setLastFetchedTosdrJSON(no_sub_url,json_data);
        
    }
    if(!(json_data["site"] === no_sub_url)){
        let sub_heading_url = document.getElementById("url_subheading");
        sub_heading_url.innerHTML = "( " + json_data["site"] + " )";
    }


    clear_tosdr_boxes();
    let good_p_element = document.getElementById("goodTosdrInfoBoxes");
    let bad_p_element = document.getElementById("badTosdrInfoBoxes");
    json_data["information"].forEach(element => create_tosdr_info_card(good_p_element,bad_p_element,element));
    showGoodTab();
    
}

function clear_info_card(){
    let info_box_div = document.getElementById("siteInfoBoxes");
    let info_box_parent = info_box_div.parentNode;
    info_box_div.remove();
    let new_info_box_div = document.createElement("div");
    new_info_box_div.className = "infoBoxes";
    new_info_box_div.id = "siteInfoBoxes";
    info_box_parent.append(new_info_box_div);
}

function clear_tosdr_boxes(){
    let good_p_element = document.getElementById("goodTosdrInfoBoxes");
    let bad_p_element = document.getElementById("badTosdrInfoBoxes");
    let gp = good_p_element.parentNode;
    let bp = bad_p_element.parentNode;
    good_p_element.remove();
    bad_p_element.remove();
    let new_good_p_element = document.createElement("div");
    let new_bad_p_element = document.createElement("div");
    new_good_p_element.className = good_p_element.className;
    new_good_p_element.id = good_p_element.id;
    new_bad_p_element.className = bad_p_element.className;
    new_bad_p_element.id = bad_p_element.id;
    gp.append(new_good_p_element);
    bp.append(new_bad_p_element)
}

function create_info_card(parent_element,json_info){
    const info_card = document.createElement("div");
    
    const info_card_heading_link = document.createElement("a");
    info_card_heading_link.setAttribute("href",json_info.Source);
    info_card_heading_link.setAttribute("target","_blank");

    const info_card_heading = document.createElement("h2");
    info_card_heading.innerHTML = json_info.Title;

    info_card_heading_link.append(info_card_heading);

    const info_card_tag = document.createElement("h3");
    info_card_tag.innerHTML = json_info.Tag;

    const info_card_description = document.createElement("p");
    info_card_description.innerHTML = json_info.Description;

    const bottom_bar = document.createElement("div");
    bottom_bar.className = "seperationBar";

    info_card.append(info_card_heading_link);
    info_card.append(info_card_tag);
    info_card.append(info_card_description);
    info_card.append(bottom_bar);

    info_card.className = "infoCard";
    
    parent_element.append(info_card);
}

function create_tosdr_info_card(good_parent_element, bad_parent_element,json_info) {
    const info_card = document.createElement("div");
    const info_card_heading = document.createElement("h2");
    info_card_heading.innerHTML = json_info.title;
    const info_card_category = document.createElement("h3");
    info_card_category.innerHTML = json_info.classification;
    const info_card_text = document.createElement("p");
    info_card_text.innerHTML = json_info.description;
    const bottom_bar = document.createElement("div");
    bottom_bar.className = "seperationBar";
    info_card.append(info_card_heading);
    //info_card.append(info_card_category);
    info_card.append(info_card_text);
    info_card.append(bottom_bar);

    if(json_info.classification === "bad" || json_info.classification == "blocker"){
        info_card.className = "infoCard infoCardBad";
        bad_parent_element.append(info_card);
    }else if(json_info.classification === "good"){
        info_card.className = "infoCard infoCardGood";
        good_parent_element.append(info_card);
    }else{
        info_card.className = "infoCard";
    }

}
function remove_subdomains(url){
    let x = url.split(".");
    let final = []
    for (i = 0; i < x.length; i++) {
        if (!subdomains.includes(x[i])) {
            final.push(x[i]);
        }
    }
    return final.join(".");
}
function remove_subdomains_and_tlds(url) {
    let x = url.split(".");
    let final = []
    for (i = 0; i < x.length; i++) {
        if (!(subdomains.includes(x[i]) || tlds.includes(x[i]))) {
            final.push(x[i]);
        }
    }
    return final.join(".");
}

function getFaviconLink(url) {
    return ('https://www.google.com/s2/favicons?domain=' + url);
  }
  

async function get_priv_shield(url) {
    //check to see if badge is in cache
    chrome.storage.local.get(url, function(result) {
        if (chrome.runtime.lastError) {
            console.log("Cache miss on badge!");
        } else {
            console.log("FETCHED LINK FROM STORAGE!");
            return result[url];
        }
    });
    //make search request
    //if a response is found return the shield of the first response
    console.log("searching for SHIELD: ", url);
    const res = await fetch("https://api.tosdr.org/search/v4/?query=" + url);
    const resJSON = await res.json();
    

    if (resJSON["parameters"]["services"].length == 0) {
        return "";
    } else {
        let badge = resJSON["parameters"]["services"][0]["links"]["crisp"]["badge"]["png"];
        cache_shield_link(url,badge);
        return badge;
    }
}



function cache_shield_link(url,badge){
    chrome.storage.local.set({[url]: badge }).then(() => {
        console.log("cached badge successfully");
    });
}

function switchToTab(tab) {
    hideAllTabs();
    setCurrentTab(tab.id);
    tab.style.display = "block";
}

function hideAllTabs() {
    console.log("ive been called!");
    for (i = 0; i < tabs.length; i++) {
        console.log("Hiding tab!");
        tabs[i].style.display = "none";
    }
}

function setCurrentTab(tabName) {
    //change this to save to chrome storage
    chrome.storage.local.set({ "currentTab": tabName }).then(() => {
        console.log("current tab set to: ", tabName);
    });
}


async function getTosdrJsonForSite(site) {
    console.log("Making call!");
    // let api_url = "http://127.0.0.1:8000/tosdr/" + site;
    let api_url = "https://minfp2.herokuapp.com/tosdr/" + site;
    console.log("TOSDR URL: " + api_url);
    console.log("URL: " + api_url);
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data)
    console.log("site: " + data["site"])
    // return data["site"],data["information"];
    return data;
}

async function getInfoJsonForSite(site) {
    console.log("Making call!");
    let tag_str = await getButtonsStateAsString();
    // let api_url = "http://127.0.0.1:8000/info/" + site + "?tags="+tag_str;
    let api_url = "https://minfp2.herokuapp.com/info/" + site + "?tags="+tag_str;
    console.log("URL: " + api_url);
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data)
    return data["information"];
}

function setLastFetchedTosdrJSON(site,json){
    chrome.storage.local.set({ "lastFetchedSiteTosdr": site}).then(() => {
        console.log("last site set to: ", site);
    });
    chrome.storage.local.set({ "lastFetchedTosdrJSON": json }).then(() => {
        console.log("cachedjson");
    });
}

function setLastFetchedInfoJSON(site,json){
    chrome.storage.local.set({ "lastFetchedSiteInfo": site}).then(() => {
        console.log("last site set to: ", site);
    });
    chrome.storage.local.set({ "lastFetchedInfoJSON": json }).then(() => {
        console.log("cachedjson");
    });   
}
async function getLastFetchedInfoJSON() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("lastFetchedInfoJSON", function(result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result["lastFetchedInfoJSON"]);
        }
      });
    });
  }

async function getLastFetchedSiteInfo() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("lastFetchedSiteInfo", function(result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.lastFetchedSiteInfo);
        }
      });
    });
  }

async function getLastFetchedTosdrJSON() {    
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("lastFetchedTosdrJSON", function(result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result["lastFetchedTosdrJSON"]);
        }
      });
    });
  }
  

async function getLastFetchedSiteTosdr() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("lastFetchedSiteTosdr", function(result) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.lastFetchedSiteTosdr);
        }
      });
    });
  }
  

function showGoodTab(){
    let goodTab = document.getElementById("goodTosdrInfoBoxes");
    let badTab = document.getElementById("badTosdrInfoBoxes");
    badTab.style.display = "none";
    goodTab.style.display = "block";
}

function showBadTab(){
    let goodTab = document.getElementById("goodTosdrInfoBoxes");
    let badTab = document.getElementById("badTosdrInfoBoxes");
    goodTab.style.display = "none";
    badTab.style.display = "block";
}


function describeCookies(){
    let description = document.getElementById("setting_description");
    description.innerHTML="Information stored in your browser and sent to a website with each request to identify you";
}

function describePersonalisation(){
    let description = document.getElementById("setting_description");
    description.innerHTML="How websites change their behaviour to reflect what they know about you";
}

function describeDataSharing(){
    let description = document.getElementById("setting_description");
    description.innerHTML="Information about you that is shared with other parties and services";
}

function describeTracking(){
    let description = document.getElementById("setting_description");
    description.innerHTML="View and choose methods employed to track and monitor your behaviour and preferences";
}

function describeCommunication(){
    let description = document.getElementById("setting_description");
    description.innerHTML="Communications such as emails and advertising sent to you by a website";
}

function describeVisibility(){
    let description = document.getElementById("setting_description");
    description.innerHTML="Control which pieces of your information are visible to other users of the website";
}

function describeHistory(){
    let description=document.getElementById("setting_description");
    description.innerHTML = "Control how sites store and use your browsing history";
}

function describeOptOut(){
    let description=document.getElementById("setting_description");
    description.innerHTML = "Display known automatically gathered opt-out links for a given site. Gathered by Opt-Out Easy from UsablePrivacy.";
}



function clearDescription(){
    let description = document.getElementById("setting_description");
    description.innerHTML = "";
}

function changeSettings(){
    //get current state of each checkbox
    //save it to chrome storage
    let settings_state = [
        cookie_setting.checked,
        personalisation_setting.checked,
        data_sharing_setting.checked,
        tracking_setting.checked,
        communication_setting.checked,
        data_visibility_setting.checked,
        history_setting.checked,
        opt_out_setting.checked
    ]

    chrome.storage.local.set({ "settings": settings_state }).then(() => {
        console.log("SAVED SETTINGS!");
        console.log(settings_state);
    });
}

async function getButtonsStateAsString(){
    let state = await getButtonsState();
    console.log(state);
    console.log("JUST PRINTED STATE");
    let ret_str = "";
    if (state[0]){
        ret_str = ret_str + "cookies,";
    }

    if(state[1]){
        ret_str = ret_str + "personalisation,";
    }

    if(state[2]){
        ret_str = ret_str + "sharing,";
    }

    if(state[3]){
        ret_str = ret_str + "tracking,";
    }

    if(state[4]){
        ret_str = ret_str + "communication,";
    }

    if(state[5]){
        ret_str = ret_str + "visibility,";
    }

    if(state[6]){
        ret_str = ret_str + "history,";
    }

    if(state[7]){
        ret_str = ret_str + "optOut,";
    }

    if(ret_str.charAt(ret_str.length-1)){
        ret_str = ret_str.slice(0,-1);
    }
    console.log("BUTTON STRING: " + ret_str);
    return ret_str;
}

async function getButtonsState(){
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("settings", function(result) {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(result.settings);
          }
        });
      });
    }


function setSettingButtonsToSavedValues(){
    console.log("I am here!");
    chrome.storage.local.get("settings", function(result) {
        if (chrome.runtime.lastError) {
            return [];
        } else {
            cookie_setting.checked = result.settings[0]?true:false;
            personalisation_setting.checked = result.settings[1]?true:false;
            data_sharing_setting.checked = result.settings[2]?true:false;
            tracking_setting.checked = result.settings[3]?true:false;
            communication_setting.checked = result.settings[4]?true:false;
            data_visibility_setting.checked = result.settings[5]?true:false;
            history_setting.checked = result.settings[6]?true:false;
            opt_out_setting.checked = result.settings[7]?true:false;
        }
    });
}