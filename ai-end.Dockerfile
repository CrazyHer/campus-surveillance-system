FROM continuumio/miniconda3:latest

ENV TZ=Asia/Shanghai
RUN echo $TZ > /etc/timezone && \
  ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
  dpkg-reconfigure -f noninteractive tzdata

COPY ./ai-end /usr/share/campus-surveillance-system/ai-end

WORKDIR /usr/share/campus-surveillance-system/ai-end

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6 -y &&\
  conda env create -f environment.yml -n ai-end

CMD ["/opt/conda/envs/ai-end/bin/python3", "main.py"]