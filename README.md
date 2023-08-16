# Cloudflare DNS Record Deletion Tool

This script allows you to automatically delete all DNS records from your Cloudflare dashboard with a single button click.

## Features

- **Delete All DNS Records** button addition to the Cloudflare DNS dashboard.
- Automated DNS record deletion in sequence.
- Informative console logs and alerts for better feedback.
- Dynamically detects and adds the button to ensure compatibility with future Cloudflare changes.

## Installation

1. Copy the script provided above.
2. Use a browser extension like Tampermonkey or Greasemonkey to manage and run the script.
3. Navigate to your Cloudflare dashboard.

## Usage

1. Navigate to your Cloudflare DNS dashboard.
2. Look for the "Delete All DNS Records" button that should appear above your DNS records table.
3. Click on the button, and the script will start deleting the DNS records one by one.
4. The process can be observed via the console logs.

## Notes

- The script assumes the structure of the Cloudflare dashboard. If Cloudflare makes significant changes to its structure, the XPath in the script might need updating.
- The source code is Open source, so you could easily edit all lines of codes and even edit the xpath if Cloudflare made significant changes on their website.
- Always ensure you have backed up important DNS records before running the script.

## Disclaimer

Use this script with caution. Deleting DNS records can disrupt services that rely on those records. The creator is not responsible for any disruptions or damages that may arise due to the use of this script.

## Contributions

This script was developed by SyntaxSurge / Jade. If you find any issues or would like to suggest improvements, please open an issue or submit a pull request.
