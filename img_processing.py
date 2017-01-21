import base64
import numpy as np
import hickle
import pickle
from PIL import Image
from io import BytesIO
from uuid import uuid4
import os
from keras.preprocessing import image


def image_data2array(b64data):
    # image_data = Image.open(BytesIO(base64.b64decode(b64data))).getdata()
    img = image.load_img(BytesIO(base64.b64decode(b64data)), target_size=(64, 64))
    image_array = image.img_to_array(img)
    # image_array = np.asarray(image_data)
    # data = { 
    #     'uid': uid,
    #     'frame': frame,
    #     'data': image_array
    #     }
    # print image_array
    return image_array


# Assume all frames come in order
def batch_convert(inc_data_list):
    data_list = []
    for data in inc_data_list:
        # data2convert = (
        #     data['uid'],
        #     data['frame'],
        #     data['data'],
        # )
        data_list.append(image_data2array(data))
    return data_list


def store_b64_str(data, filename):
    with open('./data/b64/' + filename + '.pkl', 'w') as f:
        pickle.dump(data, f)


def store_nparray(array_list, classname):
    print type(array_list)
    if not os.path.exists('./data/' + classname):
        os.makedirs('./data/' + classname)
    with open('./data/' + classname + '/' + str(uuid4()) + '.hkl', 'w') as f:
        hickle.dump(array_list, f)
    with open('./data/' + classname + '/' + str(uuid4()) + '.pkl', 'w') as f:
        pickle.dump(array_list, f)
    with open('./data/' + classname + '/' + str(uuid4()) + '.out', 'w') as f:
        f.write(str(array_list))


def retrieve_nparray(filename):
    with open('./data/' + filename + '.hkl') as f:
        array_list = hickle.load(f)
    return array_list


    # ######turn b64 string into jpg and save
    # filename = 'example_b64_str_img.txt'
    # with open(filename) as f:
    #     img_data = base64.b64decode(f.read().strip())
    # with open(filename + '.jpg','w+') as f:
    #     f.write(img_data)

    ######## testing
    # filename = 'example_b64_str_img.txt'
    # with open(filename) as f:
    #     img_data = f.read().strip()
    #     test = []
    #     for i in range(5):
    #         test.append((i,i,img_data))
    #     result = batch_convert(test)
    #     print result[3]
