#!/bin/bash

# Script to download all required technology logos for the portfolio
# Run this script to download all missing logos

cd "$(dirname "$0")/assets/img"

echo "Downloading technology logos..."

# Programming Languages
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" -o python-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" -o cpp-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" -o javascript-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" -o matlab-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" -o mysql-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" -o bash-logo.png

# AI & ML
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" -o pytorch-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" -o tensorflow-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" -o opencv-logo.png
curl -L "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" -o sklearn-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" -o numpy-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" -o pandas-logo.png

# Robotics & Automation
curl -L "https://upload.wikimedia.org/wikipedia/commons/b/bb/Ros_logo.svg" -o ros-logo.png
curl -L "https://raw.githubusercontent.com/osrf/gazebo_design/master/logos/gazebo_vert_pos.png" -o gazebo-logo.png

# Cloud & DevOps
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" -o aws-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" -o docker-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" -o kubernetes-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" -o git-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" -o linux-logo.png
curl -L "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" -o gcp-logo.png

# Generative AI & LLMs
curl -L "https://avatars.githubusercontent.com/u/126733545?s=200&v=4" -o langchain-logo.png
curl -L "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" -o huggingface-logo.png

# Generic placeholders for concepts
echo "Creating placeholder icons for abstract concepts..."
# For LiDAR, SLAM, Sensor Fusion, Vector DBs, RAG - we'll use generic tech icons
cp python-logo.png lidar-icon.png
cp python-logo.png slam-icon.png
cp python-logo.png sensor-fusion-icon.png
cp python-logo.png vectordb-icon.png
cp python-logo.png rag-icon.png
cp python-logo.png openai-logo.png
cp python-logo.png claude-logo.png

echo "✅ Logo download complete!"
echo "Note: Some logos are placeholders. You can replace them with custom icons later."
