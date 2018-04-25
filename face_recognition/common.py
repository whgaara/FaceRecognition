# coding: utf-8
import os
import random
import cv2
from FaceRecognition import settings


def format_logs():
    acupoints_list = []

    for log_file in os.listdir(settings.LOG_PATH):
        f = open(settings.LOG_PATH + log_file, 'r', encoding='utf_8_sig')
        log_data = f.read()
        acupoints = log_data.split('\n')
        acupoints_dict = {}
        for acupoint in acupoints:
            acu_attrs = acupoint.split(',', 1)
            acupoints_dict[acu_attrs[0]] = acu_attrs[1]
        acupoints_list.append(acupoints_dict)
        f.close()

    return acupoints_list


def operate_img(img_name):
    try:
        image_path = settings.SOURCE_PATH + img_name

        count = 1
        face_cascade = cv2.CascadeClassifier('static/classify/haarcascade_frontalface_default.xml')
        img = cv2.imread(image_path)
        if type(img) != str:
            faces = face_cascade.detectMultiScale(img, 1.1, 5)
            if len(faces):
                for (x, y, w, h) in faces:
                    if w >= 128 and h >= 128:
                        new_x = int(x)
                        new_w = min(int((x + w)), img.shape[1])
                        new_y = int(y)
                        new_h = min(int((y + h)), img.shape[0])
                        f = cv2.resize(img[new_y:new_h, new_x:new_w], (new_w - new_x, new_h - new_y))
                        cv2.imwrite(settings.TARGET_PATH + '\\' + '%s.jpg' % img_name, f)
                        count += 1
    except IOError:
        print("Error")


if __name__ == '__main__':
    format_logs()
