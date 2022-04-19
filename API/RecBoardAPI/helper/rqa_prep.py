import numpy as np
from itertools import groupby
from collections import Counter
from bson.objectid import ObjectId
import math
###### START: Preparation #####

'''
The following code belongs to an deprecated calculation logic and is therefore commented out

'''

# def get_recurrence_chains(rec_mat_norm):
#     rec_chain = []
#     for row in rec_mat_norm:
#         chain = ' '
#         chain = chain.join(map(str, row))
#         chain = chain.replace(" ", "")
#         chain = chain.split("0")
#         chain = list(filter(None, chain))
#         rec_chain = rec_chain + chain

#     return rec_chain


# def get_diagonal_chains(rec_mat_norm):
#     diags = [rec_mat_norm[::1, :].diagonal(
#         i) for i in range(-rec_mat_norm.shape[0]+1, rec_mat_norm.shape[1])]

#     return diags


# def wordListToFreqDict(rec_chain):
#     freq = [rec_chain.count(p) for p in rec_chain]
#     return dict(list(zip(rec_chain, freq)))  # freqdict


# def sortFreqDict(freqdict):
#     freq = [(freqdict[key], key) for key in freqdict]
#     freq.sort()
#     freq.reverse()
#     return freq


# def get_frequency_of_data(freqdict):
#     result = []
#     for item in freqdict:
#         result.append((item[0], len(item[1])))
#     return result


# def clean_data(freqdict):
#     freqdict = [i for i in freqdict if i[1] == 1]
#     return freqdict


# def get_recurrence_freq(thrshld_mat):
#     rec_chains = get_recurrence_chains(thrshld_mat)  # GET RECURRENCE CHAINS
#     freqDict = wordListToFreqDict(rec_chains)
#     freqDict_sorted = sortFreqDict(freqDict)  # sorted
#     # Format: (Anzahl, Länge der Kette)
#     chain_freq = get_frequency_of_data(freqDict_sorted)

#     return chain_freq


# def get_recurrence_freq_diag(thrshld_mat):
#     rec_chains_diag = get_diagonal_chains(
#         thrshld_mat)  # GET DIAOGONAL RECURRENCE MATRIX
#     rec_chains_diag = get_recurrence_chains(
#         rec_chains_diag)  # GET RECURRENCE CHAINS

#     freqDict = wordListToFreqDict(rec_chains_diag)
#     freqDict_sorted = sortFreqDict(freqDict)  # sorted
#     # Format: (Anzahl, Länge der Kette)
#     chain_freq = get_frequency_of_data(freqDict_sorted)

#     return chain_freq


# def get_rr(chain_frequency):
#     rr_n = 0
#     # Hier müsste eine Anpassung vorgenommen werden, falls eine andere Matrix getestet werden soll.
#     rr_z = 5400**2
#     for item in chain_frequency:
#         rr_n += item[0]*item[1]

#     rr = rr_n / rr_z
#     return rr

# # req_chain-Format: [(Anzahl1, Länge1), (Anzahl2, Länge2),...]
# # det = diagonal recurrence chains
# # lam = vertical recurrence chains

# # Der Algorithmus ist unabhängig von der Art der Matrix, wonach keine Unterscheidung zwischen diagonaler Kette und vertikaler Kette erfolgt


# def get_det_lam(req_chain, rr):
#     det_lam_n = 0
#     for item in req_chain:
#         if(item[1] < 3):
#             continue
#         else:
#             det_lam_n += item[0]*item[1]

#     det_lam = det_lam_n / rr
#     return det_lam

# # req_chain-Format: [(Anzahl1, Länge1), (Anzahl2, Länge2),...]
# # Der Algorithmus ist unabhängig von der Art der Matrix, wonach keine Unterscheidung zwischen diagonaler Kette und vertikaler Kette erfolgt


# def get_l_tt(req_chain):
#     l_tt_z = 0
#     l_tt_n = 0
#     for item in req_chain:
#         if(item[1] < 3):
#             continue
#         else:
#             l_tt_z += item[0]*item[1]
#             l_tt_n += item[0]

#     l_tt = l_tt_z / l_tt_n

#     return l_tt


# def get_entr(chain_freq):
#     anzahl_ketten = sum(a for a, l in chain_freq)
#     entr = 0

#     for item in chain_freq:
#         if(item[1] < 3):
#             continue
#         else:
#             p = item[0] / anzahl_ketten
#             entr_p = p * np.log2(p)
#             entr += entr_p

#     entr = entr*(-1)

#     return entr


# def create_rqa(thrshld_mat):
#     req_chain = get_recurrence_freq(thrshld_mat)
#     req_chain_diag = get_recurrence_freq_diag(thrshld_mat)

#     rr = get_rr(req_chain)
#     det = get_det_lam(req_chain_diag, rr)
#     lam = get_det_lam(req_chain, rr)
#     l = get_l_tt(req_chain_diag)
#     tt = get_l_tt(req_chain)
#     entr = get_entr(req_chain_diag)
#     entr_vert = get_entr(req_chain)

#     rqa = {
#         "rr": rr,
#         "det": det,
#         "lam": lam,
#         "l": l,
#         "tt": tt,
#         "entr": entr,
#         "entr_vert": entr_vert
#     }

#     return rqa


# #################################### v2 #########################################

'''
Current calculation logic of all rqa-parameters
'''


def numpy_fillna(data):
    # Get lengths of each row of data
    lens = np.array([len(i) for i in data])

    # Mask of valid places in each row
    mask = np.arange(lens.max()) < lens[:, None]

    # Setup output array and put elements from data into masked positions
    out = np.zeros(mask.shape, dtype=data.dtype)
    out[mask] = np.concatenate(data)
    return out


def get_rqas(rp_thrsld, rps_collection, rp_id):
    rqa = {}
    rr_n = np.sum(rp_thrsld) - math.sqrt(2) * len(rp_thrsld)
    rr_z = len(rp_thrsld)**2
    rr = rr_n / rr_z

    # Insert rr to RP-ID
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"rr": rr}}
    rps_collection.update_one(query, newvalues)

    min_chain_length = 3

    zero_list = np.zeros((rp_thrsld.shape[0], 1))
    rp_thrsld_zeros = np.hstack((rp_thrsld, zero_list))
    x = list(np.array(rp_thrsld_zeros).flat)
    grouped = (list(g) for _, g in groupby(enumerate(x), lambda t: t[1]))
    vertical_chains = [(g[0][0], g[-1][0] + 1)
                       for g in grouped if len(g) >= min_chain_length]

    result_list = []
    lam_z = 0
    tt_n = len(vertical_chains)

    for item in vertical_chains:

        if x[item[0]] == 1:
            chain_length = item[1]-item[0]
            result_list.append(chain_length)

            lam_z += chain_length

        else:
            continue

    lam = lam_z / rr_n
    # Insert lam to RP-ID
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"lam": lam}}
    rps_collection.update_one(query, newvalues)

    tt = lam_z / tt_n
    # Insert tt to RP-ID
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"tt": tt}}
    rps_collection.update_one(query, newvalues)

    rqa["rr"] = rr
    rqa["lam"] = lam
    rqa["tt"] = tt

    entr = 0
    chain_length_list = dict(Counter(result_list))  # {length1, amount1, ...}

    for key in chain_length_list:

        p = chain_length_list[key] / tt_n
        entr_p = p * np.log2(p)
        entr += entr_p

    entr_v = abs(entr)
    rqa["entr-v"] = entr_v
    # Insert entr-v to RP-ID
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"entr-v": entr_v}}
    rps_collection.update_one(query, newvalues)

    ######## Diagonal RQA ##############

    diags = [rp_thrsld[::1, :].diagonal(
        i) for i in range(-rp_thrsld.shape[0]+1, rp_thrsld.shape[1])]
    diags_norm = numpy_fillna(np.asarray(diags))

    zero_list = np.zeros((np.asarray(diags_norm).shape[0], 1))
    rp_thrsld_zeros = np.hstack((diags_norm, zero_list))
    x = list(np.array(rp_thrsld_zeros).flat)
    grouped = (list(g) for _, g in groupby(enumerate(x), lambda t: t[1]))
    diagonal_chains = [(g[0][0], g[-1][0] + 1)
                       for g in grouped if len(g) >= min_chain_length]

    result_list = []
    det_z = 0
    l_n = len(diagonal_chains)

    for item in diagonal_chains:

        if x[item[0]] == 1:
            chain_length = item[1]-item[0]
            if chain_length == len(diags_norm[0]):
                continue
            else:
                result_list.append(chain_length)

                det_z += chain_length

        else:
            continue

    det = det_z / rr_n
    # Insert det to RP-ID
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"det": det}}
    rps_collection.update_one(query, newvalues)
    l = det_z / l_n
    # Insert l to RP-ID
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"l": l}}
    rps_collection.update_one(query, newvalues)

    rqa["det"] = det
    rqa["l"] = l

    entr = 0
    chain_length_list = dict(Counter(result_list))  # {length1, amount1, ...}

    for key in chain_length_list:

        p = chain_length_list[key] / l_n
        entr_p = p * np.log2(p)
        entr += entr_p

    rqa["entr"] = entr*(-1)
    # Insert entr to RP-ID
    query = {"_id": ObjectId(rp_id)}
    newvalues = {"$set": {"entr": entr}}
    rps_collection.update_one(query, newvalues)

    return rqa
