const targetClassName = 'x193iq5w xeuugli x13faqbe x1vvkbs xlh3980 xvmahel x1n0sxbx x1lliihq x1s928wv xhkezso x1gmr53x x1cpjm7i x1fgarty x1943h6x x4zkp8e x3x7a5m x1lkfr7t x1lbecb7 x1s688f xzsf02u';

const closeButtonLabelVi = "Đóng bản xem trước liên kết"
const closeButtonLabelEn = "Close link preview"

const followingButtonLabelVi = "Đang theo dõi"
const followingButtonLabelEn = "Following"

const unfollowingButtonLabelVi = "Bỏ theo dõi"
const unfollowingButtonLabelEn = "Unfollow"

const updateButtonLabelVi = "Cập nhật"
const updateButtonLabelEn = "Update"

function getLanguageInfo() {
  const lang = document.documentElement.lang || "unknown";

  console.log("🌍 Facebook language detected:", lang);

  return lang;
}

const language = getLanguageInfo();

function findCloseButton() {
  const closeButtonLabel = language.startsWith("vi") ? closeButtonLabelVi : closeButtonLabelEn;
  const closeBtn = document.querySelector(
    `div[role="button"][aria-label*="${closeButtonLabel}"]`
  );

  if (closeBtn) {
    console.log("✅ Found close button:", closeBtn);
    return closeBtn;
  }

  console.log("❌ Close button not found");
  return null;
}

// Utility function to add a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to click an element by its text content
async function clickElementByText(text) {
    const element = Array.from(document.querySelectorAll('*'))
        .find(el => el.textContent.trim() === text);

    if (element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Scroll the element into view
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Create and dispatch the click event
        const mouseEvent = new MouseEvent('click', {
            clientX: centerX,
            clientY: centerY,
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(mouseEvent);
        console.log(`Clicked on element with text "${text}" at (x: ${centerX + window.scrollX}, y: ${centerY + window.scrollY})`);

        await delay(100); // Adjust delay as needed
    } else {
        console.log(`Element with text "${text}" not found.`);
    }
}

// Function to unfollow a profile by name
async function unfollowProfileByName(profileName) {
    const profileElement = profileName.element;

    if (profileElement) {
        // Simulate hover
        profileElement.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));

        // Wait for the button to appear
        await delay(1000);

        // Locate and click the "Đang theo dõi" button
        const followingLabel = language.startsWith("vi") ? followingButtonLabelVi : followingButtonLabelEn;
        const unfollowingLabel = language.startsWith("vi") ? unfollowingButtonLabelVi : unfollowingButtonLabelEn;

        const followButton = document.querySelector(
            `div[aria-label="${followingLabel}"]`
        );

        if (followButton) {
            followButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            followButton.click();
            console.log(`Clicked the "${followingLabel}" button for ${profileName}`);

            // Add delay before proceeding
            await delay(1000);

            // Click the button
            await clickElementByText(unfollowingLabel);

            // Wait for the UI to update
            await delay(1000); // Increased delay for UI update

            // Check for and click the "Cập nhật" button if it exists
            const updateButtonLabel = language.startsWith("vi") ? updateButtonLabelVi : updateButtonLabelEn;
            const updateButton = document.querySelector(
                `div[aria-label="${updateButtonLabel}"]`
            );

            if (updateButton) {
                updateButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                updateButton.click();
                console.log(`Clicked the "${updateButtonLabel}" button for ${profileName}`);

                // Wait for the UI to update
                await delay(1000);
            }
        } else {
            console.log(`"${followingLabel}" button not found for ${profileName}`);
        }

        const closeButton= findCloseButton();
        if (closeButton) {
            closeButton.click();
            console.log("❎ Popup closed!");
        }

    } else {
        console.log(`Profile ${profileName} not found`);
    }
}

// Function to extract profile names from span elements
function extractProfiles() {
    const spanElements = document.querySelectorAll(`span.${targetClassName.replace(/\s+/g, '.')}`);
    const profiles = [];

    spanElements.forEach(element => {
        const name = element.textContent.trim();
        if (name && isValidProfileName(name)) { // Filter based on name length
            profiles.push({
                name,
                element: element,
            });
        }
    });
    return profiles;
}

// Function to validate if a name is likely a profile name
function isValidProfileName(name) {
    // Define a length threshold to differentiate profile names from page names
    const lengthThreshold = 20; // Adjust this value based on observed patterns

    // Ensure the name is reasonably short and not empty
    return name.length > 1 && name.length <= lengthThreshold;
}

// Extract the profile names and log them
// Step 1: Extract all profile names
let profileNames = extractProfiles();

// Step 2: List of profiles to ignore
const ignoreProfileList = ["VinRobotics"];

// Step 3: Convert ignore list to Set (fast lookup)
const ignoreSet = new Set(ignoreProfileList);

// Step 4: Remove ignored profiles from main list
profileNames = profileNames.filter(
  item => !ignoreSet.has(item.name)
);

console.log("Final profile list:", profileNames);

// Function to process all profiles and show progress
async function processAllProfiles() {
    const totalProfiles = profileNames.length;
    
    for (let i = 0; i < totalProfiles; i++) {
        const profile = profileNames[i];
        console.log(`Processing profile ${i + 1} of ${totalProfiles}: ${profile}`);
        
        await unfollowProfileByName(profile);
        // await delay(200); // Add a delay between processing each profile if needed

        // Calculate and log progress
        const progress = ((i + 1) / totalProfiles) * 100;
        console.log(`Progress: ${progress.toFixed(2)}%`);
    }
}

processAllProfiles();
