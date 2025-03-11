# AdTrix - AMP Ads Inspector Extension

## Overview
AdTrix is a powerful Chrome DevTools extension designed to help developers, publishers, and advertisers inspect, analyze, and debug AMP (Accelerated Mobile Pages) ads on web pages. This tool provides real-time insights into AMP ad performance, configuration, and behavior directly within your browser's developer tools.

## Key Features
- **Dedicated DevTools Panel**: Custom "AMP ADS" panel integrated into Chrome DevTools for seamless debugging experience
- **Real-time Ad Inspection**: Monitor and analyze AMP ads as they load and render on web pages
- **Network Monitoring**: Track ad-related network requests and responses
- **Performance Metrics**: Analyze loading times and performance metrics for AMP ads
- **Configuration Viewer**: Inspect AMP ad configurations and parameters
- **Modern Tech Stack**: Built with React 19 and Webpack for optimal performance and maintainability

## Technical Requirements
- Node.js version: v22.14.0
- Chrome Browser
- Yarn package manager

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Build the extension:
   ```bash
   # For development with hot-reload
   yarn dev

   # For production build
   yarn build
   ```
4. Load the extension in Chrome:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

## Usage
1. Open Chrome DevTools (F12 or Right-click > Inspect)
2. Navigate to the "AMP ADS" panel
3. Browse websites with AMP ads to start inspecting

## Development
The extension is built using modern web technologies:
- React 19 for UI components
- Webpack for bundling
- Chrome Extensions Manifest V3
- Service Workers for background processing

## Contributing
Contributions are welcome! Please feel free to submit pull requests, create issues, or suggest improvements.

## License
This project is open source and available under the MIT License.

