#!/bin/bash

# Google Cloud Run Deployment Script for ContractFlow
#
# Prerequisites:
#   1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install
#   2. Authenticate: gcloud auth login
#   3. Set your project: gcloud config set project YOUR_PROJECT_ID
#   4. Enable required APIs:
#      gcloud services enable cloudbuild.googleapis.com
#      gcloud services enable run.googleapis.com
#      gcloud services enable containerregistry.googleapis.com

set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="${REGION:-us-central1}"
SERVICE_NAME="contract-flow"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "========================================"
echo "ContractFlow - Google Cloud Run Deployment"
echo "========================================"
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo "========================================"

# Check if project is set
if [ -z "$PROJECT_ID" ]; then
    echo "Error: No project ID set. Run 'gcloud config set project YOUR_PROJECT_ID'"
    exit 1
fi

# Build the Docker image
echo ""
echo "Building Docker image..."
docker build -t $IMAGE_NAME:latest .

# Push to Google Container Registry
echo ""
echo "Pushing image to Container Registry..."
docker push $IMAGE_NAME:latest

# Deploy to Cloud Run
echo ""
echo "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME:latest \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --port 3000

# Get the service URL
echo ""
echo "========================================"
echo "Deployment complete!"
echo "========================================"
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')
echo "Your application is available at: $SERVICE_URL"
