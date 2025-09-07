import { prisma } from "@db/client";

export default class MessageLogServices {
  // Create message
  static async createMessage(
    title: string,
    content: string,
    recipientId: string | null,
    senderId: string
  ) {
    // Determine if recipientId is a student or guardian
    let studentId: string | null = null;
    let guardianId: string | null = null;
    let type = "private";

    if (recipientId) {
      // Check if recipientId is a student
      const student = await prisma.student.findUnique({ where: { id: recipientId } });
      if (student) {
        studentId = recipientId;
      } else {
        // Check if recipientId is a guardian
        const guardian = await prisma.guardian.findUnique({ where: { id: recipientId } });
        if (guardian) {
          guardianId = recipientId;
        }
      }
    } else {
      type = "bulk";
    }
    const message = await prisma.messageLog.create({
      data: {
        content,
        type,
        senderId,
        studentId,
        guardianId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return message;
  }

  // Find message by ID
  static async findById(id: string) {
    const message = await prisma.messageLog.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!message) throw new Error("Message not found");
    return message;
  }

  // Get all messages
  static async getAllMessages() {
    return await prisma.messageLog.findMany({
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Update message
  static async updateMessage(
    id: string,
    data: {
      title?: string;
      content?: string;
      recipientId?: string | null;
      isRead?: boolean;
    }
  ) {
    // Convert recipientId to studentId/guardianId if provided
    let updateData: any = {
      content: data.content,
      isRead: data.isRead,
    };

    if (data.recipientId !== undefined) {
      if (data.recipientId) {
        const student = await prisma.student.findUnique({ where: { id: data.recipientId } });
        if (student) {
          updateData.studentId = data.recipientId;
          updateData.guardianId = null;
        } else {
          const guardian = await prisma.guardian.findUnique({ where: { id: data.recipientId } });
          if (guardian) {
            updateData.guardianId = data.recipientId;
            updateData.studentId = null;
          }
        }
      } else {
        updateData.studentId = null;
        updateData.guardianId = null;
      }
    }
    const message = await prisma.messageLog.update({
      where: { id },
      data: updateData,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return message;
  }

  // Delete message
  static async deleteMessage(id: string) {
    const message = await prisma.messageLog.findUnique({
      where: { id },
    });

    if (!message) throw new Error("Message not found");

    return await prisma.messageLog.delete({
      where: { id },
    });
  }

  // Paginate messageLog
  static async paginate(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const messageLog = await prisma.messageLog.findMany({
      skip,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    const total = await prisma.messageLog.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: messageLog,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Search messageLog
  static async search(search: string, page: number = 1, limit?: number) {
    const whereClause = {
      OR: [
        {
          content: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          sender: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
        {
          student: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
        {
          guardian: {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        },
      ],
    };

    const messageLog = await prisma.messageLog.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: limit ? (page - 1) * limit : 0,
      take: limit,
      orderBy: {
        sentAt: "desc",
      },
    });

    return messageLog;
  }

  // Count searched messageLog
  static async countSearched(search: string) {
    return await prisma.messageLog.count({
      where: {
        OR: [
          {
            content: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            sender: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            student: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
          {
            guardian: {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          },
        ],
      },
    });
  }

  // Paginate searched messageLog
  static async paginateSearched(page: number, limit: number, search: string) {
    const messageLog = await this.search(search, page, limit);
    const total = await this.countSearched(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: messageLog,
      total,
      totalPages,
      currentPage: page,
    };
  }

  // Get messageLog by student
  static async getByStudent(studentId: string) {
    return await prisma.messageLog.findMany({
      where: { studentId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Get messageLog by guardian
  static async getByGuardian(guardianId: string) {
    return await prisma.messageLog.findMany({
      where: { guardianId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Get messageLog by sender
  static async getBySender(senderId: string) {
    return await prisma.messageLog.findMany({
      where: { senderId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Get messages by student or guardian
  static async getMessagesByRecipient(studentId?: string, guardianId?: string) {
    const whereClause: any = {};

    if (studentId) {
      whereClause.studentId = studentId;
    }
    if (guardianId) {
      whereClause.guardianId = guardianId;
    }

    return await prisma.messageLog.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Mark message as read
  static async markAsRead(id: string) {
    const message = await prisma.messageLog.findUnique({
      where: { id },
    });

    if (!message) throw new Error("Message not found");

    return await prisma.messageLog.update({
      where: { id },
      data: { isRead: true },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Mark message as unread
  static async markAsUnread(id: string) {
    const message = await prisma.messageLog.findUnique({
      where: { id },
    });

    if (!message) throw new Error("Message not found");

    return await prisma.messageLog.update({
      where: { id },
      data: { isRead: false },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Get unread messages count
  static async getUnreadCount(userId?: string) {
    const whereClause: any = { isRead: false };
    
    if (userId) {
      whereClause.OR = [
        { senderId: userId },
        { studentId: userId },
        { guardianId: userId }
      ];
    }

    return await prisma.messageLog.count({
      where: whereClause,
    });
  }

  // Get unread messages
  static async getUnreadMessages(userId?: string) {
    const whereClause: any = { isRead: false };
    
    if (userId) {
      whereClause.OR = [
        { senderId: userId },
        { studentId: userId },
        { guardianId: userId }
      ];
    }

    return await prisma.messageLog.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Delete many messageLog
  static async deleteMany(ids: string[]) {
    return await prisma.messageLog.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  // Get message statistics
  static async getStatistics(userId?: string) {
    const whereClause: any = {};

    if (userId) {
      whereClause.senderId = userId;
    }

    const totalmessageLog = await prisma.messageLog.count({
      where: whereClause,
    });

    const sentmessageLog = await prisma.messageLog.count({
      where: userId ? { senderId: userId } : {},
    });

    const studentMessages = await prisma.messageLog.count({
      where: { studentId: { not: null } },
    });

    const guardianMessages = await prisma.messageLog.count({
      where: { guardianId: { not: null } },
    });

    return {
      totalmessageLog,
      sentmessageLog,
      studentMessages,
      guardianMessages,
    };
  }

  // Get messages sent by a specific user
  static async getMessagesBySender(senderId: string) {
    return await prisma.messageLog.findMany({
      where: { senderId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "asc",
      },
    });
  }

  // Get broadcast messageLog (messageLog with no specific recipient)
  static async getBroadcastmessageLog() {
    return await prisma.messageLog.findMany({
      where: { 
        AND: [
          { studentId: null },
          { guardianId: null }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Get recent messageLog
  static async getRecentmessageLog(limit: number = 10, userId?: string) {
    const whereClause: any = {};

    if (userId) {
      whereClause.senderId = userId;
    }

    return await prisma.messageLog.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
      take: limit,
    });
  }

  // Get messages by recipient (student or guardian)
  static async getByRecipient(recipientId: string) {
    return await prisma.messageLog.findMany({
      where: {
        OR: [
          { studentId: recipientId },
          { guardianId: recipientId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
    });
  }

  // Mark multiple messages as read
  static async markMultipleAsRead(ids: string[]) {
    return await prisma.messageLog.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        isRead: true,
      },
    });
  }

  // Get conversation between two users
  static async getConversation(user1Id: string, user2Id: string) {
    return await prisma.messageLog.findMany({
      where: {
        OR: [
          {
            AND: [
              { senderId: user1Id },
              {
                OR: [
                  { studentId: user2Id },
                  { guardianId: user2Id }
                ]
              }
            ]
          },
          {
            AND: [
              { senderId: user2Id },
              {
                OR: [
                  { studentId: user1Id },
                  { guardianId: user1Id }
                ]
              }
            ]
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
          },
        },
        guardian: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        sentAt: "asc",
      },
    });
  }

  // Get broadcast messages (alias for getBroadcastmessageLog)
  static async getBroadcastMessages() {
    return this.getBroadcastmessageLog();
  }

  // Get recent messages (alias for getRecentmessageLog)
  static async getRecentMessages(limit: number = 10, userId?: string) {
    return this.getRecentmessageLog(limit, userId);
  }
}
