# coding: utf8
import cv2
from FaceRecognition.settings import *


def get_all_path(dirpath, *suffix):
    path_array = []
    for r, ds, fs in os.walk(dirpath):
        for fn in fs:
            if os.path.splitext(fn)[1] in suffix:
                fname = os.path.join(r, fn)
                path_array.append(fname)
    return path_array


def read_pic_save_face(source_path, target_path, *suffix):
    try:
        image_paths = get_all_path(source_path, *suffix)
        count = 1
        face_cascade = cv2.CascadeClassifier('static/classify/haarcascade_frontalface_default.xml')
        for imagePath in image_paths:
            img = cv2.imread(imagePath)
            if type(img) != str:
                faces = face_cascade.detectMultiScale(img, 1.1, 5)
                if len(faces):
                    for (x, y, w, h) in faces:
                        if w >= 128 and h >= 128:
                            file_name = str(count)
                            new_x = int(x)
                            new_w = min(int((x + w)), img.shape[1])
                            new_y = int(y)
                            new_h = min(int((y + h)), img.shape[0])
                            f = cv2.resize(img[new_y:new_h, new_x:new_w], (new_w - new_x, new_h - new_y))
                            cv2.imwrite(target_path + '\\' + '%s.jpg' % file_name, f)
                            count += 1
    except IOError:
        print("Error")


if __name__ == '__main__':
    read_pic_save_face(IMG_PATH, TARGET_PATH, '.jpg', '.JPG', 'png', 'PNG')
