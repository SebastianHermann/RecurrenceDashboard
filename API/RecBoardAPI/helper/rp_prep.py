from helper.rqa_prep import create_rqa, get_rqas
import numpy as np
from scipy.spatial import distance_matrix
import skimage.measure


def create_relative_matrix(df):
    df = df[["x_norm", "y_norm"]]

    df_a = df[['x_norm', 'y_norm']].to_numpy()
    df_b = df[['x_norm', 'y_norm']].to_numpy()

    player_matrix = distance_matrix(df_a, df_b)
    return player_matrix


def create_cross_relative_matrix(df, df_cross):
    df = df[["x_norm", "y_norm"]]
    df_cross = df_cross[["x_norm", "y_norm"]]

    df_a = df[['x_norm', 'y_norm']].to_numpy()
    df_b = df_cross[['x_norm', 'y_norm']].to_numpy()

    player_matrix = distance_matrix(df_a, df_b)
    return player_matrix


def create_thrshld_matrix(rec_mat_rel, threshold):
    rec_mat_norm = (rec_mat_rel < threshold).astype(int)
    return rec_mat_norm


def prep_recurrence_plot(df, rp_meta):
    df_result = None
    cond_1 = len(rp_meta["target_group_1"]) > 0
    cond_2 = len(rp_meta["target_group_2"]) > 0

    if rp_meta["mirror_cord"] & cond_1 & cond_2:
        df["x_norm"] = np.where(df['target_group_id'] ==
                                2, 105-df["x_norm"], df["x_norm"])
        df["y_norm"] = np.where(df['target_group_id'] ==
                                2, 68-df["y_norm"], df["y_norm"])

    if cond_1 & ~cond_2:
        df_result = df[
            (df["target_group_id"] == 1) &
            (df["mapped_id"].isin(rp_meta["target_group_1"])) &
            (df["game_id"] == rp_meta["game_id"])
        ]
    elif ~cond_1 & cond_2:
        df_result = df[
            (df["target_group_id"] == 2) &
            (df["mapped_id"].isin(rp_meta["target_group_2"])) &
            (df["game_id"] == rp_meta["game_id"])
        ]
    elif cond_1 & cond_2:
        df_result = df[((df["target_group_id"] == 1) &
                        (df["mapped_id"].isin(rp_meta["target_group_1"])) &
                        (df["game_id"] == rp_meta["game_id"])) | ((df["target_group_id"] == 2) &
                                                                  (df["mapped_id"].isin(rp_meta["target_group_2"])) &
                                                                  (df["game_id"] == rp_meta["game_id"]))]
    else:
        df_result = df[df["game_id"] == rp_meta["game_id"]]

    return df_result


def prep_cross_recurrence_plot(df, rp_meta):
    df_result = None
    cond_1 = len(rp_meta["cross_group_1"]) > 0
    cond_2 = len(rp_meta["cross_group_2"]) > 0

    if rp_meta["mirror_cord"] & cond_1 & cond_2:
        df["x_norm"] = np.where(df['target_group_id'] ==
                                2, 105-df["x_norm"], df["x_norm"])
        df["y_norm"] = np.where(df['target_group_id'] ==
                                2, 68-df["y_norm"], df["y_norm"])

    if cond_1 & ~cond_2:
        df_result = df[
            (df["target_group_id"] == 1) &
            (df["mapped_id"].isin(rp_meta["cross_group_1"])) &
            (df["game_id"] == rp_meta["game_id"])
        ]
    elif ~cond_1 & cond_2:
        df_result = df[
            (df["target_group_id"] == 2) &
            (df["mapped_id"].isin(rp_meta["cross_group_2"])) &
            (df["game_id"] == rp_meta["game_id"])
        ]
    elif cond_1 & cond_2:
        df_result = df[((df["target_group_id"] == 1) &
                        (df["mapped_id"].isin(rp_meta["cross_group_1"])) &
                        (df["game_id"] == rp_meta["game_id"])) | ((df["target_group_id"] == 2) &
                                                                  (df["mapped_id"].isin(rp_meta["cross_group_2"])) &
                                                                  (df["game_id"] == rp_meta["game_id"]))]
    else:
        df_result = df[df["game_id"] == rp_meta["game_id"]]

    return df_result


def downsample_rp(rp, downsample_param):
    ds_rp = skimage.measure.block_reduce(
        rp, (downsample_param, downsample_param), np.median)

    return ds_rp


def create_recurrence_plot(rp_meta, df, df_cross=None):

    if rp_meta["calc_logic"] == "avg":
        df_result = df.groupby(["game_time_seconds"], as_index=False).mean()

    if df_cross is not None:
        df_cross = df_cross.groupby(
            ["game_time_seconds"], as_index=False).mean()

    if rp_meta["rp_type"] == "threshold":
        relative = create_relative_matrix(df_result)
        original = create_thrshld_matrix(relative, rp_meta["threshold"])

    elif rp_meta["rp_type"] == "relative":
        original = create_relative_matrix(df_result)

    elif rp_meta["rp_type"] == "cross_threshold":
        cross = create_cross_relative_matrix(df_result, df_cross)
        original = create_thrshld_matrix(cross, rp_meta["threshold"])

    elif rp_meta["rp_type"] == "cross_relative":
        original = create_cross_relative_matrix(df_result, df_cross)

    result = downsample_rp(original, rp_meta["downsample"])

    return result, original
