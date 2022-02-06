from helper.rp_prep import create_recurrence_plot, prep_cross_recurrence_plot, prep_recurrence_plot
import numpy as np
from bson.objectid import ObjectId

min_rec_points = 0.2
white_space_width = 45

# [result_45, result_45_rec]= create_rectangle_matrix("Test",rec_thrshld_18, min_rec_points, white_space_width)


def create_meta_stable_rp(thrshld_matrix, min_rec_points, width_white_lines, rps_collection, rp_id):

    counter = 0
    c = []
    input_list = sum(thrshld_matrix)
    input_list = np.where(input_list/len(thrshld_matrix)
                          > min_rec_points, 1, 0)

    for row in input_list:
        if(row == 1):
            counter = 0
        else:
            counter += 1
        c.append(counter)

    counter = 0
    d = []
    for row in input_list[::-1]:
        if(row == 1):
            counter = 0
        else:
            counter += 1
        d.append(counter)

    e = np.array(c) + np.array(d[::-1])
    e = np.where(e < width_white_lines, 1, 0)

    output_1 = []
    for item in e:
        if(item == 1):
            row = np.ones(len(e))
        else:
            row = np.zeros(len(e))
        output_1.append(row)

    counter = 0
    c = []
    input_2 = thrshld_matrix.transpose()
    input_list_2 = sum(input_2)
    input_list_2 = np.where(
        input_list_2/len(thrshld_matrix) > min_rec_points, 1, 0)

    for row in input_list_2:
        if(row == 1):
            counter = 0
        else:
            counter += 1
        c.append(counter)

    counter = 0
    d = []
    for row in input_list_2[::-1]:
        if(row == 1):
            counter = 0
        else:
            counter += 1
        d.append(counter)

    e = np.array(c) + np.array(d[::-1])
    e = np.where(e < width_white_lines, 1, 0)

    output_2 = []
    for item in e:
        if(item == 1):
            row = np.ones(len(e))
        else:
            row = np.zeros(len(e))
        output_2.append(row)

    output_2 = np.array(output_2).transpose()

    output_rec = output_1 + output_2
    output_rec = np.where(output_rec == 2, 2, 0)

    result = output_rec + thrshld_matrix
    # meta_rp, meta_rec
    frp1_blue = sum(sum(output_rec))*0.5
    frp1 = frp1_blue / len(output_rec)**2
    # insert into db
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"frp1": frp1}}
    rps_collection.update_one(query, newvalues)

    frp2_black = sum(sum(np.where(result == 3, 1, 0)))
    frp2 = frp2_black / frp1_blue
    # insert into db
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"frp2": frp2}}
    rps_collection.update_one(query, newvalues)

    frp3_rr = sum(sum(thrshld_matrix))
    frp3 = frp2_black / frp3_rr
    # insert into db
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"frp3": frp3}}
    rps_collection.update_one(query, newvalues)

    return result, output_rec
