//console.log("[SPDL] SPDevLinks extension loaded.");

chrome.storage.sync.get(
    { extTrigger: 'both' },
    (items) => {
      
        //if(items.extTrigger === "both" || items.extTrigger === "mouseover")
        if(true)
        {
            $("body").mousemove(function (e) {
                var mousePosX = e.pageX;
                var mousePosY = e.pageY;
                var windowW = window.innerWidth;
                var windowH = window.innerHeight;
                if (mousePosX > (windowW - 50) && mousePosY < 22) {

                    if(items.extTrigger === "both" || items.extTrigger === "mouseover")
                    {
                        $("#spdevtools-panel-wrapper").css("display", "none");
                    }

                    if(items.extTrigger === "both" || items.extTrigger === "icon")
                    {
                        AddDevToolsButton('openClosePanel', '', '-128px', '-32px', openClosePanel);
                    }
                }
                if (mousePosX > (windowW - 50) && (mousePosY > 22 && mousePosY < 40)) {

                    if(items.extTrigger === "both" || items.extTrigger === "mouseover")
                    {
                        $("#spdevtools-panel-wrapper").css("display", "block");
                    }

                    if(items.extTrigger === "both" || items.extTrigger === "icon")
                    {
                        AddDevToolsButton('openClosePanel', '', '-128px', '-32px', openClosePanel);
                    }
                }
            });
        }
    }
  );

function getAbsoluteUrl() {
    
    var returnUrl = window.location.href;

    //neither sites or teams url
    if (returnUrl.indexOf("/teams/") === -1 && returnUrl.indexOf("/sites/") === -1) {
        
        //remove everything after any potential question character
        returnUrl = returnUrl.split('?')[0];

        //settings page
        if(returnUrl.indexOf("/_layouts/15/settings.aspx") !== -1)
        {
            returnUrl = returnUrl.replace("/_layouts/15/settings.aspx", "");
        }
        else
        {
            //permissions page
            if(returnUrl.indexOf("/_layouts/15/user.aspx") !== -1)
            {
                returnUrl = returnUrl.replace("/_layouts/15/user.aspx", "");
            }
            else
            {
                //home page
                if(returnUrl.indexOf("/Pages/default.aspx") !== -1)
                {
                    returnUrl = returnUrl.replace("/Pages/default.aspx", "");
                }
                else
                {
                    //unknown url, not teams or sites or specific keywords
                    returnUrl = new URL(returnUrl);
                    returnUrl = "https://" + returnUrl.hostname;
                }
            }
        }
        
    }

    //teams url
    if (returnUrl.indexOf("/teams/") !== -1) {
        returnUrl = new URL(returnUrl);
        var relPathNameTeams = returnUrl.pathname.replace("/teams/", "");
        if (relPathNameTeams.indexOf("/") !== -1) {
            relPathNameTeams = relPathNameTeams.replace(/\/.*/, "");
        }
        returnUrl = "https://" + returnUrl.hostname + "/teams/" + relPathNameTeams;
    }

    //sites url
    if (returnUrl.indexOf("/sites/") !== -1) {
        returnUrl = new URL(returnUrl);
        var relPathNameSites = returnUrl.pathname.replace("/sites/", "");
        if (relPathNameSites.indexOf("/") !== -1) {
            relPathNameSites = relPathNameSites.replace(/\/.*/, "");
        }
        returnUrl = "https://" + returnUrl.hostname + "/sites/" + relPathNameSites;
    }

    return returnUrl;
    
}

//adds the open/close button, adds also the invididual buttons
//each image is taken from the sprite. exceptions can be used
//button wrapped already added to body tag
function AddDevToolsButton(id, btn_title, img_x, img_y, callback) {
    if (id == "openClosePanel" && document.getElementById("openClosePanel") !== null) {
        return;
    }

    var rootElement = '#spdevtools-panel';

    //*** BUTTONS ***
    //each button must associated to a root/parent element (the element that will store this button's html as a child)

    //IN DIALOGS, SHOW A LINK TO THE URL IN THE IFRAME
    if (id == 'getIframeLink' && window.location.href.indexOf('IsDlg') > -1) {
        rootElement = '.ms-cui-topBar2';
    }

    //SHAREPOINT 2010 - OPEN/CLOSE BUTTONo
    if (id == "openClosePanel" && typeof _spPageContextInfo != "undefined" && _spPageContextInfo.webUIVersion === 4) {
        rootElement = '#RibbonContainer-TabRowRight';
    }
    //SHAREPOINT 2016/2019 - OPEN/CLOSE BUTTON
    if (id == "openClosePanel" && document.getElementById("O365_TopMenu") !== null && window.location.href.indexOf(".sharepoint.com") === -1) {
        rootElement = '#O365_TopMenu > div > span';
    }

    //SHAREPOINT 2013 - OPEN/CLOSE BUTTON
    if (id == "openClosePanel" && document.getElementById("O365_TopMenu") === null && typeof _spPageContextInfo != "undefined" && _spPageContextInfo.webUIVersion === 15 && window.location.href.indexOf(".sharepoint.com") === -1) {
        rootElement = '#siteactiontd';
    }

    //SHAREPOINT ONLINE - OPEN/CLOSE BUTTON (CONTEXT)
    if (id == "openClosePanel" && document.getElementById("O365_TopMenu") === null && window.location.href.indexOf(".sharepoint.com") !== -1 && typeof _spPageContextInfo != "undefined") {
        rootElement = '#HeaderButtonRegion';
    }

    //SHAREPOINT ONLINE - OPEN/CLOSE BUTTON (NO CONTEXT)
    if (id == "openClosePanel" && document.getElementById("O365_TopMenu") === null && window.location.href.indexOf(".sharepoint.com") !== -1 && typeof _spPageContextInfo == "undefined" && $("#O365_MainLink_Settings_container").children().length === 0) {
        rootElement = '#HeaderButtonRegion';
    }
    if (id == "openClosePanel" && document.getElementById("O365_TopMenu") === null && window.location.href.indexOf(".sharepoint.com") !== -1 && typeof _spPageContextInfo == "undefined" && $("#O365_MainLink_Settings_container").children().length !== 0) {
        rootElement = '#HeaderButtonRegion';
    }

    //sprite path
    var imgPath2010 = "/_layouts/1033/images/formatmap16x16.png";
    var imgPath2013 = "/_layouts/15/1033/images/formatmap16x16.png";
    var imgPath = imgPath2010;

    //override recycle button icons
    if (id == "openRecycleBin" || id === "openRecycleBinAdmin") {
        imgPath = "/_layouts/images/recycbin.gif";
    }
    if(id == "openClosePanel")
    {
        imgPath = chrome.runtime.getURL("images/icon-16.png");
        img_x = 0;
        img_y = 0;
    }

    //button html
    var toAdd = "";
    toAdd += '<span style="background:none;cursor:pointer;text-align:left;font-family:Segoe UI;font-size:14px;" class="s4-breadcrumb-anchor" id="' + id + '"><span class="ms-cui-img-16by16 ms-cui-img-cont-float" style="margin-left:auto;margin-right:auto;position:relative;width:16px;height:16px;display:inline-block;overflow:hidden;" unselectable="on"><img alt="' + btn_title + '" title="' + btn_title + '" style="position:absolute;top: ' + img_y + '; left: ' + img_x + ';" src="' + imgPath + '" alt="" unselectable="on" /></span> ' + btn_title + '</span>';
    toAdd += "<br/>";

    //commit add
    $(rootElement).append(toAdd);
    eval(callback)();

    //MAKE SURE RIBBONS ARE ALWAYS VISIBLE IF HIDDEN
    if ($("#suiteBar").css("display") === "none") {
        $("#suiteBar").css("display", "block");
    }
    if ($("#ms-designer-ribbon").css("display") === "none") {
        $("#ms-designer-ribbon").css("display", "block");
    }

}

function CmdViewAllSiteContent() {
    $('#siteContentLink').click(function () {
        window.location.href = getAbsoluteUrl().replace(/\/$/, "") + "/_layouts/15/viewlsts.aspx";
    });
}
function CmdExplorerView() {
    $('#customOpenInExplorer').click(function () {
        var urlToOpen = 'file://' + (location.hostname + (location.port ? ':' + location.port : '') + location.pathname.substring(0, location.pathname.lastIndexOf('/')).replace('/Forms', ''));
        window.prompt('Here is the path for file explorer', urlToOpen);
    });
}
function CmdHomeView() {
    $('#customOpenInHome').click(function () {
        window.location.href = getAbsoluteUrl();
    });
}
function openClosePanel() {
    $('#openClosePanel').click(function () {
        $("#spdevtools-panel-wrapper").toggle();
    });
}
function CmdViewCount() {
    $('#getViewCount').click(function () {
        if (ctx.TotalListItems == null)
            alert("View Count is null: Try mouseover on the view.");
        else
            alert("View Count (this page only): " + ctx.TotalListItems);
    });
}
function CmdExpandScroll() {
    $('#makeFullScreen').click(function () {
        $("#s4-workspace").css("height", "100%").css("overflow", "visible");
        alert("scroll expanded!");
    }
    );
}
function CmdItemCount() {
    $('#getListCount').click(function () {
        var itemcount = 0;
        var context = SP.ClientContext.get_current();
        var web = context.get_web();
        var currentList = web.get_lists().getByTitle(ctx.ListTitle);
        context.load(currentList);
        context.executeQueryAsync(
            Function.createDelegate(this, function (sender, args) {
                alert('List Item Count: ' + currentList.get_itemCount());
            }),
            Function.createDelegate(this, function (sender, args) {
                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            })
        );
    });
}
function CmdWebTemplateID() {
    $('#getWebTemplateID').click(function () {
        window.prompt('Here is this site Template ID', g_wsaSiteTemplateId);
    });
}
function CmdGoToListTemplates() {
    $('#getListTemplateLink').click(function () {
        window.location.href = getAbsoluteUrl() + "/_catalogs/lt/Forms/AllItems.aspx";
    });
}
function CmdWebID() {
    $('#getWebID').click(function () {

        var context = new SP.ClientContext.get_current();
        web = context.get_web();
        context.load(web);
        context.executeQueryAsync(
            Function.createDelegate(this, function (sender, args) {
                window.prompt('Here is this site Template ID', web.get_id());
            }),
            Function.createDelegate(this, function (sender, args) {
                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            })
        );



    });
}
function CmdSiteID() {
    $('#getSiteID').click(function () {
        //go to /_api/site/id
        window.location.href = getAbsoluteUrl().replace(/\/$/, "") + "/_api/site/id";
    });
}
function CmdListTemplateID() {
    $('#getListTemplateID').click(function () {
        window.prompt('Here is this list Template ID', g_wsaListTemplateId);
    });
}
function CmdSaveTemplate() {
    $('#saveSiteAsTemplate').click(function () {
        var currentUrl = (window.location.href.substring(0, window.location.href.lastIndexOf('/')));
        currentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
        window.location.href = currentUrl + "/_layouts/savetmpl.aspx";
    });
}
function areYouSure(message) {
    return confirm('Are you sure you want to: ' + message);
}
function GetListId()
{
    return _spPageContextInfo.pageListId;
}
function GoToListSettings() {
    $('#listSettingsLink').click(function () {

        if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo.pageListId !== null) {
            //get list id from script object
            //var listId = _spPageContextInfo.pageListId;//not accessible            
            var spDomCtx = _spPageContextInfo.innerText;
            var listId = spDomCtx.toString().replace(/.*listId":"/, '');
            listId = listId.replace(/}.*/s, '}');
            var goToSettingsListUrl = getAbsoluteUrl() + "/_layouts/15/listedit.aspx?List=" + listId;
            window.location.href = goToSettingsListUrl;
        }
        else {
            alert("Cannot find an active list.");
        }
    });
}
function GoToPreservHold() {
    $('#listPreservHold').click(function () {
        window.location.href = getAbsoluteUrl() + "/PreservationHoldLibrary";
    });
}
function GoToCTErrorLog() {
    $('#cterrorlogLink').click(function () {
        window.location.href = getAbsoluteUrl() + "/Lists/ContentTypeSyncLog/AllItems.aspx";
    });
}
function GoToSiteSettings() {
    $('#siteSettingsLink').click(function () {
        var settingsUrl = getAbsoluteUrl() + "/_layouts/15/settings.aspx";
        if(settingsUrl.indexOf("undefined") === -1)
            window.location.href = settingsUrl;
    });
}
function GoToSiteTitle() {
    $('#siteTitle').click(function () {
        var settingsUrl = getAbsoluteUrl() + "/_layouts/15/prjsetng.aspx";
        window.location.href = settingsUrl;
    });
}
function GoToSiteSettingsNavElem() {
    $('#siteSettingsLinkNavElem').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/navoptions.aspx";
    });
}
function GoToSiteSettingsNavSet() {
    $('#siteSettingsLinkNavSet').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/AreaNavigationSettings.aspx";
    });
}

function RecycleList() {
    $('#recycleList').click(function () {
        if (!areYouSure("Recycle the current list?")) {
            return;
        }
        var context = SP.ClientContext.get_current();
        var web = context.get_web();
        var currentList = web.get_lists().getByTitle(ctx.ListTitle);
        context.load(currentList);
        currentList.recycle();
        context.executeQueryAsync(
            Function.createDelegate(this, function (sender, args) {
                alert("List recycled!");
                window.location.href = getAbsoluteUrl();
            }),
            Function.createDelegate(this, function (sender, args) {
                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            })
        );
    });
}
function RecycleItem() {
    $('#recycleItem').click(function () {
        if (!areYouSure("Recycle the current item?")) {
            return;
        }
        var context = SP.ClientContext.get_current();
        var web = context.get_web();
        var currentList = web.get_lists().getByTitle(ctx.ListTitle);
        var items = SP.ListOperation.Selection.getSelectedItems(ctx);
        if (items.length !== 1) {
            alert("must only select one item!");
        }
        else {
            var itemToDelete = currentList.getItemById(items[0].id);
            itemToDelete.recycle();
            context.executeQueryAsync(
                Function.createDelegate(this, function (sender, args) {
                    alert("Item recycled!");
                    window.location.href = window.location.href;
                }),
                Function.createDelegate(this, function (sender, args) {
                    alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                })
            );
        }
    });
}
function CmdCheckedOutDocs() {
    $('#seeCheckOutDocs').click(function () {

        var checkedOutPrefix = '?';
        if (window.location.href.indexOf("?") !== -1)
            checkedOutPrefix = "&";

        var checkOutUrl = window.location.href + checkedOutPrefix + 'SortField=CheckoutUser&SortDir=Desc';

        if (window.location.href.indexOf(".sharepoint.com") !== -1)
            checkOutUrl = window.location.href + checkedOutPrefix + 'isAscending=false&sortField=CheckoutUser';

        window.location.href = checkOutUrl;

    });
}
function CmdRefreshPage() {
    $('#refreshThisPage').click(function () {
        window.location.href = window.location.href.replace('#', '');
    });
}
function CmdOpenSitePermissions() {
    $('#openSitePermissions').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/user.aspx";
    });
}
function CmdOpenSiteAdmins() {
    $('#openSiteAdmins').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/mngsiteadmin.aspx";
    });
}
function CmdOpenCheckVersion() {
    $('#checkVersion').click(function () {
        var context = SP.ClientContext.get_current();
        context.executeQueryAsync(
            Function.createDelegate(this, function (sender, args) {
                //var serverVersion = context.get_serverVersion();
                alert("ServerVersion: " + context.get_serverVersion() + " ServerSchemaVersion: " + context.get_serverSchemaVersion());
            }),
            Function.createDelegate(this, function (sender, args) {
                alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            })
        );
    });
}
function CmdOpenCheckRoles() {
    $('#checkRoles').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/role.aspx";
    });
}
function CmdOpenCheckSiteGroups() {
    $('#checkSiteGroups').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/groups.aspx";
    });
}
function CmdOpenCheckDefaultGroups() {
    $('#checkDefaultGroups').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/permsetup.aspx";
    });
}
function CmdAccessRequests() {
    $('#accessRequests').click(function () {
        window.location.href = getAbsoluteUrl() + "/Access%20Requests/pendingreq.aspx";
    });
}
function CmdUserList() {
    $('#userList').click(function () {
        window.location.href = getAbsoluteUrl() + "/_catalogs/users/simple.aspx";
    });
}

function CmdOpenRecycleBin() {
    $('#openRecycleBin').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/AdminRecycleBin.aspx?view=5";
    });
}
function CmdOpenRecycleBinAdmin() {
    $('#openRecycleBinAdmin').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/AdminRecycleBin.aspx?view=5#view=13";
    });
}
function CmdCreateFolder() {
    $('#createFolder').click(function () {
        window.location.href = ctx.listUrlDir + "/Forms/Upload.aspx?RootFolder=" + encodeURIComponent(ctx.listUrlDir) + "&Type=1";
    });
}
function CmdListUniquePerms() {
    $('#openListUniquePerms').click(function () {
        if (window.location.href.indexOf(",doclib") === -1 && window.location.href.indexOf(",list") === -1) {
            alert("Navigate to the list permissions first!");
        }
        else {
            window.location.href = window.location.href.replace('/user.aspx', '/uniqperm.aspx');
        }
    });
}
function CmdSiteUniquePerms() {
    $('#openSiteUniquePerms').click(function () {
        window.location.href = getAbsoluteUrl() + "/_layouts/15/uniqperm.aspx";
    });
}
function CmdSignInAsAnotherUser() {
    $('#signInAsAnotherUser').click(function () {
        var signInUrl = "";
        if (_spPageContextInfo.webUIVersion === 4) {
            signInUrl = "/_layouts/closeConnection.aspx?loginasanotheruser=true";//2010
        }
        else {
            signInUrl = "/_layouts/15/closeConnection.aspx?loginasanotheruser=true";//2013
        }
        var sourceUrl = window.location.href;
        var encodedSourceUrl = encodeURIComponent(sourceUrl).replace(/\./g, '%2E');
        var currentWebUrl = getAbsoluteUrl();
        if (currentWebUrl === "/") {
            currentWebUrl = "";
        }
        var navigateUrl = currentWebUrl + signInUrl + "&Source=" + encodedSourceUrl;
        window.location.href = navigateUrl;
    });
}
function CmdListSettingsLink() {
    $('#replaceListLink').click(function () {
        if (window.location.href.toLocaleLowerCase().indexOf("/_layouts/listedit.aspx?list=") > 0 || window.location.href.toLocaleLowerCase().indexOf("/_layouts/15/listedit.aspx?list=") > 0) {
            $("#idItemHoverTable th:contains('Web Address:')").next().html("<a href='" + $("#idItemHoverTable th:contains('Web Address:')").next().html() + "'>" + "click here to go back to the list</a>");
        }
    });
}
function CmdIframeLink() {
    $('#getIframeLink').click(function () {
        var iframeUrl = "not found";
        if (window.location.href.indexOf('IsDlg') == -1) {
            iframeUrl = window.location.href.replace('#', '');
        }
        else {
            var parentWindow = window.parent.document;
            var iframes = $('iframe', parentWindow);
            for (var i = 0; i < iframes.length; i++) {
                if ((iframes[i] !== null) && (iframes[i].src !== null)) {
                    if (iframes[i].src.indexOf('http://') > - 1) {
                        iframeUrl = iframes[i].src.replace("&IsDlg=1", "");
                    }
                }
            }
        }
        window.prompt('Here is the URL for this page/frame', iframeUrl);
    });
}

//startup
$(document).ready(function () {

    var curUrl = new URL(window.location.href);
    //console.log("[SPDL] SP Dev Tools active on " + curUrl.hostname);
    var panelHtml = '<div id="spdevtools-panel-wrapper" style="overflow:auto; position: absolute;top: 83px;right: 0;background: lightgray;width: 250px;height: 100%;z-index: 1000000;padding: 20px; display:none;"><div id="spdevtools-panel" style="height:calc(100vh - 149px);overflow-y:auto;"></div></div>';
    $("body").append(panelHtml);

    chrome.storage.sync.get(
        { extTrigger: 'both' },
        (items) => {
          
            if(items.extTrigger === "both" || items.extTrigger === "icon")
            {
                AddDevToolsButton('openClosePanel', '', '-128px', '-32px', openClosePanel);
            }
        }
      );
    
        
    /*
    if (typeof _spPageContextInfo !== 'undefined') {
        AddDevToolsButton('openClosePanel', '', '-128px', '-32px', openClosePanel);
    }
    else {
        if (true) {
            if (window.self !== window.top) {
                return;
            }
            var fastAdded = false;
            var timesRun = 0;
            var checkExist = setInterval(function () {
                //make sure the timer does not run forever
                timesRun += 1;
                if (timesRun === 100) {
                    clearInterval(checkExist);
                }
                else {
                    //add the button quickly as soon as the root element is available but keep trying
                    if (document.getElementById("HeaderButtonRegion") !== null && fastAdded === false) {
                        AddDevToolsButton('openClosePanel', '', '-128px', '-32px', openClosePanel);
                        fastAdded = true;
                    }
                    //add the button (if not there already) in case the DOM kills the previous button
                    if (document.getElementById("HeaderButtonRegion") !== null && $("#O365_MainLink_Settings_container").children().length !== 0) {
                        AddDevToolsButton('openClosePanel', '', '-128px', '-32px', openClosePanel);
                        clearInterval(checkExist);
                    }
                }
            }, 100);
        }        
    }
    */


    //using 2010 sprint - not pickable in spritecow, but supported in 2010+2013+office 365
    AddDevToolsButton('customOpenInHome', 'Go to home page', '-176px', '-112px', CmdHomeView);
    AddDevToolsButton('siteContentLink', 'Go to site content', '-176px', '-112px', CmdViewAllSiteContent);
    AddDevToolsButton('siteSettingsLink', 'Go to site settings', '-152px', '0', GoToSiteSettings);//-169px -56px
    AddDevToolsButton('siteTitle', 'Go to site title and description', '-152px', '0', GoToSiteTitle);//-169px -56px
    AddDevToolsButton('siteSettingsLinkNavSet', 'Go to navigation settings', '-152px', '0', GoToSiteSettingsNavSet);//-169px -56px
    AddDevToolsButton('siteSettingsLinkNavElem', 'Go to navigation elements', '-152px', '0', GoToSiteSettingsNavElem);//-169px -56px
    AddDevToolsButton('customOpenInExplorer', 'Open with explorer', '-176px', '-112px', CmdExplorerView);
    AddDevToolsButton('makeFullScreen', 'Fix overflow (screen shots)', '-176px', '-112px', CmdExpandScroll);
    AddDevToolsButton('refreshThisPage', 'Refresh page (no resubmit)', '-192px', '-240px', CmdRefreshPage);
    AddDevToolsButton('getIframeLink', 'Get a link to this page', '-224px', '-160px', CmdIframeLink);

    $("#spdevtools-panel #getIframeLink").append("<br/>");

    //permissions
    AddDevToolsButton('openSitePermissions', 'Go to site permissions', '-112px', '-160px', CmdOpenSitePermissions);
    AddDevToolsButton('openSiteAdmins', 'Go to site admins', '-112px', '-160px', CmdOpenSiteAdmins);
    AddDevToolsButton('checkRoles', 'Go to permission levels', '-112px', '-160px', CmdOpenCheckRoles);
    AddDevToolsButton('checkSiteGroups', 'Go to site groups', '-112px', '-160px', CmdOpenCheckSiteGroups);
    AddDevToolsButton('checkDefaultGroups', 'Go to default groups', '-112px', '-160px', CmdOpenCheckDefaultGroups);
    AddDevToolsButton('accessRequests', 'Go to access requests', '-112px', '-160px', CmdAccessRequests);
    AddDevToolsButton('userList', 'Go to user info list', '-112px', '-160px', CmdUserList);
    AddDevToolsButton('openSiteUniquePerms', 'Go to site unique perms', '-112px', '-160px', CmdSiteUniquePerms);
    AddDevToolsButton('openListUniquePerms', 'Go to list unique perms', '-112px', '-160px', CmdListUniquePerms);
    //AddDevToolsButton('signInAsAnotherUser', 'Sign in as a different user', '-112px', '-160px', CmdSignInAsAnotherUser);

    $("#spdevtools-panel #openListUniquePerms").append("<br/>");

    //web/list/item settings
    AddDevToolsButton('listSettingsLink', 'Go to list settings', '-152px', '0', GoToListSettings);//-169px -56px
    AddDevToolsButton('listPreservHold', 'Go to preservation hold', '-152px', '0', GoToPreservHold);//-169px -56px
    AddDevToolsButton('cterrorlogLink', 'Go to content type error log', '-152px', '0', GoToCTErrorLog);//-169px -56px
    AddDevToolsButton('seeCheckOutDocs', 'Display checked out items', '0px', '-224px', CmdCheckedOutDocs);
    AddDevToolsButton('openRecycleBin', 'Go to user bin', '0px', '0px', CmdOpenRecycleBin);
    AddDevToolsButton('openRecycleBinAdmin', 'Go to second stage bin', '0px', '0px', CmdOpenRecycleBinAdmin);

    //AddDevToolsButton('getListCount', 'Get current list itemcount', '-223px', '-240px', CmdItemCount);
    //AddDevToolsButton('checkVersion', 'Check server version', '-128px', '-32px', CmdOpenCheckVersion);
    //AddDevToolsButton('getWebID', 'Get web GUID', '-80px','-48px', CmdWebID);
    //AddDevToolsButton('getSiteID', 'Get site ID', '-80px', '-48px', CmdSiteID);
    //AddDevToolsButton('getListTemplateLink', 'Go to List Template Gallery', '-152px', '0', CmdGoToListTemplates);
    //AddDevToolsButton('getWebTemplateID', 'Get web template ID', '-80px', '-48px', CmdWebTemplateID);
    //AddDevToolsButton('getListTemplateID', 'Get list template ID', '-80px', '-48px', CmdListTemplateID);
    //AddDevToolsButton('listSyncLink', 'Enable list mirroring/sync', '-152px','0', GoToListSync);//-169px -56px
    //AddDevToolsButton('getViewCount', 'Get current view ItemCount', '-208px', '-113px', CmdViewCount);
    //AddDevToolsButton('recycleList', 'Recycle this list', '-222px', '-111px', RecycleList);
    //AddDevToolsButton('recycleItem', 'Recycle this item', '-222px', '-111px', RecycleItem);
    
    //auto replace list settings url with "go back" clickable hyperlink
    if (window.location.href.toLocaleLowerCase().indexOf("/_layouts/listedit.aspx?list=") > 0 || window.location.href.toLocaleLowerCase().indexOf("/_layouts/15/listedit.aspx?list=") > 0) {
        $("#idItemHoverTable th:contains('Web Address:')").next().html("<a href='" + $("#idItemHoverTable th:contains('Web Address:')").next().html() + "'>" + "click here to go back to the list</a>");
    }

    //autosubmit
    //if (window.location.href.indexOf("&AutoSubmit=1") > 0) {
        //$("form input[type='submit'][value='OK']").trigger("click")
    //}

});
