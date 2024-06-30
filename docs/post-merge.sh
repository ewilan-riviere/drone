#!/bin/bash

pm2 stop drone
pnpm i
pnpm build
pm2 start drone
