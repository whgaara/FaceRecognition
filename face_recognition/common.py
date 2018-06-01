# coding: utf-8
import os
import random
import cv2
from FaceRecognition import settings


def format_logs():
    index = 0
    # eyes_point = []
    acupoints_list = []

    # for img_file in os.listdir(settings.IMG_BASE_PATH):
    #     eyes_point.append(origin_point(img_file))
    #
    # print(eyes_point)

    for log_file in os.listdir(settings.LOG_PATH):
        f = open(settings.LOG_PATH + log_file, 'r', encoding='utf_8_sig')
        log_data = f.read()
        acupoints = log_data.split('\n')
        acupoints_dict = {}
        for acupoint in acupoints:
            if acupoint == '':
                continue
            acu_attrs = acupoint.split(',', 1)
            coord = coord_to_scale(acu_attrs[1], log_file)
            acupoints_dict[acu_attrs[0]] = coord
            print(acupoints_dict)
        acupoints_list.append(acupoints_dict)
        f.close()
        index += 1
    # print(acupoints_list)
    return acupoints_list


def coord_to_scale(data, log_file):
    img_file = log_file[:-4]
    tmp = data.split(',')
    ox = float(tmp[0])
    oy = float(tmp[1])

    zero_x, zero_y, unit = origin_point(img_file)

    img = cv2.imread(settings.IMG_BASE_PATH + img_file)
    height = img.shape[0]
    width = img.shape[1]

    x_scale = round((ox * unit + zero_x)/width, 5)
    y_scale = round((zero_y + oy * unit + 50)/height, 5)

    # print(x_scale, y_scale)

    return x_scale, y_scale


def origin_point(img_name):
    eyes_coords = []
    image_path = settings.IMG_BASE_PATH + img_name
    face_cascade = cv2.CascadeClassifier(settings.STATIC_PATH + 'classify/haarcascade_eye.xml')
    img = cv2.imread(image_path)
    if type(img) != str:
        eyes = face_cascade.detectMultiScale(img, 1.1, 9)
        if len(eyes):
            for (x, y, w, h) in eyes:
                if w >= 70 and h >= 70:
                    eyes_coords.append((x + w/2, y))

    x = (eyes_coords[0][0] + eyes_coords[1][0]) / 2.0
    y = (eyes_coords[0][1] + eyes_coords[1][1]) / 2.0

    unit = abs(eyes_coords[0][0] - eyes_coords[1][0]) / 80.0

    return x, y, unit


def operate_img(img_name):
    try:
        image_path = settings.SOURCE_PATH + img_name

        count = 1
        face_cascade = cv2.CascadeClassifier(settings.STATIC_PATH + 'classify/haarcascade_frontalface_default.xml')
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
                        cv2.imwrite(settings.TARGET_PATH + '\\' + '%s' % img_name, f)
                        count += 1
    except IOError:
        print("Error")


if __name__ == '__main__':
    format_logs()
    # print(origin_point('0.jpg'))
