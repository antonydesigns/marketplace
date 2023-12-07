# Patch notes

## Patch note convention

Each feature/issue is labeled as a number starting from 100.

## What the app does

It's a marketplace app where guest users can browse products, users can order products, sellers can list products, and admins can have control over user and product database.

## Authorization / Authentication mechanism

Since I don't know how to use email-based auth (for example to send OTP for password recovery), I'm going to use token-based auth, what I like to call Independent ID Auth or IIDAuth or 2IDAuth for short.

I'll pre-load my user table with claimable accounts. You need an invitation key to claim an account and make it yours, create / reset a new password using this invitation key. While using the app, users can lock their account and unlock it using a password.

There is no need to re-enter the invitation code if you're using the same browser profile (User ID is stored in cookie). Standard security measures like JWT is used to keep users logged in.

## 100: Set up preparation

I'm going to create the basic structure of my app, and apply minimal styling.
