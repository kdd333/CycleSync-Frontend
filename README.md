# CycleSync Frontend

This repository contains the frontend source code for the CycleSync app.

## Contents
- [Project Overview](#project-overview)
- [Use the Deployed App](#use-the-deployed-app)
- [Developer Requirements](#developer-requirements)
- [Developer Setup Instructions](#developer-setup-instructions)
- [Running with Local Backend](#running-with-local-backend)
- [Troubleshooting](#troubleshooting)
- [Learn More](#learn-more)


## Project Overview

> **Note:** This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

This app is a fitness app made for weightlifting women which combines workout creation with period tracking to generate cycle-based exercise recommendations. Its aim is to help weightlifting women train more effectively and reduce feelings of fatigue and potential injuries from occurring. 

This project uses React Native for the frontend framework and is hosted on Expo Go. You can access the deployed app without the need to run any code or follow the setup instructions by following the instructions in the [Use the Deployed App](#use-the-deployed-app) section. 

The backend source code for this project can be found here: https://github.com/kdd333/CycleSync-Backend.git 

## Use the Deployed App

To access the deployed app, simply head to the following link: https://expo.dev/accounts/kdd333/projects/cyclesyncapp/

Then, select the latest update from the tree of updates. The new page will display the build details as well as an option to preview a QR code:
![image](https://github.com/user-attachments/assets/83bedd28-bb69-4432-83ae-50540c0100ae)

Click on this preview button to generate the QR code. Then scan it using the the camera app on your iOS or Android device to open it up on the Expo Go app.

> **Note:** You need to have the Expo Go app installed on your iOS or Android mobile device to access the deployed app. Instructions to download the Expo Go app can be found here: https://expo.dev/go

> Alternatively, you can run the app on an iOS Simulator or Android Simulator if you've set them up.

## Developer Requirements

Before running the app locally, make sure you have the following software installed and set up:

- **Node.js** and **npm**: download from https://nodejs.org/en
- **Expo Go** (optional but recommended): download from the Appstore (iOS) or Google Playstore (Android)


## Developer Setup Instructions

### 1. Clone Repository

To get started, clone this repository to your local machine. Open your terminal or Git bash and change to the directory on your local machine where you would like to save the repository (using cd command) and run the following command:

``` git clone https://github.com/kdd333/CycleSync-Backend.git ```

For more help on cloning a repository, check out the following GitHub documentation: https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository

After cloning successfully, move into the root directory by running the command:

``` cd cyclesync-frontend ```

### 2. Create and Activate a Conda Environment

Make sure you have Miniconda installed for this step. Follow these instructions on how to install Miniconda if you do not have it installed on your device: https://www.anaconda.com/docs/getting-started/miniconda/install

After installing Miniconda, create a new environment in your terminal by running the command:

``` conda create --name cyclesync-env ```

Then activate it by running:

``` conda activate cyclesync-env ```

> **Note:** You can use a different virtual environment, such as venv, if that's what you prefer. Just make sure to activate it.

### 3. Install the Project Dependencies

Make sure to run this command while in a virtual environment, such as conda or venv:

``` npm install ```

### 4. Start the Expo Development Server

Run this command to start the Expo Metro Bundler which will start the frontend server:

``` npx expo start ```

### 5. Open the App

On your mobile device, open the Expo Go app and scan the QR code shown in the terminal or browser. If using an iOS device, scan the QR code on the camera app instead. 

If using a simulator/imulator: Press `i` for iOS or `a` for Android in the terminal.

## Running with Local Backend

If you want to connect the frontend to a local Django backend server instead of the deployed server, follow these instructions:

### 1. Start the Django Backend Server 

Follow the instructions provided in the backend repository to get the local server up and running. If already setup, simply `cd` into the backend repository in a seperate terminal and run:

``` python manage.py runserver ```

Instructions for setting up the backend server can be found here: https://github.com/kdd333/CycleSync-Backend/blob/main/README.md#setup-instructions

> **IMPORTANT**: If planning to use a seperate devices to run the frontend and backend servers, make sure to run ``` python manage.py runserver 0.0.0.0:8000 ``` to allow devices in your local network to access the server.

### 2. Update Frontend API URL:

Now in the frontend, open the `config.ts` file (located in the `src/` directory) in a text editor and change the `API_BASE_URL` to the URL of the backend local server.

If using `127.0.0.1`, the file should look like this:

``` export const API_BASE_URL = 'http://127.0.0.1:800'; ```

If using `localhost`:

``` export const API_BASE_URL = 'http://localhost:800'; ```

**IMPORTANT**: If using a real mobile device and not a simulator, make sure you set this URL as your machine's local IP address so the device can access the server over Wi-Fi. You can find your machine's local IP address by following these instructions: https://www.wikihow.com/Check-a-Computer-IP-Address

### 3. Start the Expo Server

In a seperate terminal to the backend server, `cd` into the frontend directory and run `npx expo start` to start the Metro Bundler for Expo.


## Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
