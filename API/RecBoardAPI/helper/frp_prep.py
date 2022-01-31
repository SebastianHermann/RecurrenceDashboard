from helper.rp_prep import create_recurrence_plot, prep_cross_recurrence_plot, prep_recurrence_plot
import numpy as np

min_rec_points = 0.2
white_space_width = 45

# [result_45, result_45_rec]= create_rectangle_matrix("Test",rec_thrshld_18, min_rec_points, white_space_width)


def create_meta_stable_rp(thrshld_matrix, min_rec_points, width_white_lines):

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

#     # PLOT THE RESULTS
#     fig, axes = plt.subplots(1,2, figsize = (20,10))
#     ax1, ax2 = axes

#     ax1.set_xticks([0, 900, 1800, 2700, 3600, 4500, 5399])
#     ax1.set_xticklabels(['00:00', '00:15', '00:30', '00:45', '01:00','01:15','01:30'], fontsize=12)
#     ax1.set_yticks([0, 900, 1800, 2700, 3600, 4500, 5399])
#     ax1.set_yticklabels(['00:00', '00:15', '00:30', '00:45', '01:00','01:15','01:30'], fontsize=12)

#     ax1.set_title(title+": Treshold 18")
#     ax1.set_xlabel('Time [s]')
#     ax1.set_ylabel('Time [s]')
#     im = ax1.imshow(thrshld_matrix, cmap='binary')
#     fig.colorbar(im, ax=ax1)

#     plot_title = "Minimum "+str(100*min_rec_points)+"% recurrence points & "+ str(width_white_lines) + " min width of white lines"

#     cmap = colors.ListedColormap(['white','white','cornflowerblue','black'])
#     bounds=[0,1,2,3]
#     norm = colors.BoundaryNorm(bounds, cmap.N)
# #     ax2.set_title(plot_title)
#     ax2.set_xticks([0, 900, 1800, 2700, 3600, 4500, 5399])
#     ax2.set_xticklabels(['00:00', '00:15', '00:30', '00:45', '01:00','01:15','01:30'], fontsize=12)
#     ax2.set_yticks([0, 900, 1800, 2700, 3600, 4500, 5399])
#     ax2.set_yticklabels(['00:00', '00:15', '00:30', '00:45', '01:00','01:15','01:30'], fontsize=12)
#     ax2.set_xlabel('Time [s]')
#     ax2.set_ylabel('Time [s]')
#     im2 = ax2.imshow(result, interpolation='nearest', origin='lower',cmap=cmap)
#     ax2.invert_yaxis()
#     fig.colorbar(im2, cmap=cmap, norm=norm, boundaries=bounds, ticks=[0,1,2,3],ax=ax2)

#     plt.savefig(image_path+'Rechtecke/'+title+"_Thrshld_18_"+str(100-100*min_rec_points)+"_"+str(width_white_lines)+".png")

    return result, output_rec
