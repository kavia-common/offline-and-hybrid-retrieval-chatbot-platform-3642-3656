#!/bin/bash
cd /home/kavia/workspace/code-generation/offline-and-hybrid-retrieval-chatbot-platform-3642-3656/frontend_desktop_rag_chatbot
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

