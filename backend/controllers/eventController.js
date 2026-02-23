import { Event } from "../models/index.js";

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Admin/SuperAdmin)
export const createEvent = async (req, res) => {
  try {

    const { title, content, category, image, date, location } = req.body;

    // Create new event
    const event = await Event.create({
      title,
      content,
      category,
      image: image || '',
      date,
      location: location || 'Nigeria',
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// @desc    Get all events with filtering, pagination, and sorting
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      location,
      isActive,
      startDate,
      endDate,
      search,
      sortBy = 'date',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (location) filter.location = location;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const events = await Event.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalEvents = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: events.length,
      total: totalEvents,
      totalPages: Math.ceil(totalEvents / parseInt(limit)),
      currentPage: parseInt(page),
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// @desc    Get upcoming events (future dates)
// @route   GET /api/events/upcoming
// @access  Public
export const getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const now = new Date();

    const events = await Event.find({
      date: { $gte: now },
      isActive: true
    })
      .sort({ date: 1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};

// @desc    Get past events
// @route   GET /api/events/past
// @access  Public
export const getPastEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const now = new Date();

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find({
      date: { $lt: now }
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPastEvents = await Event.countDocuments({
      date: { $lt: now }
    });

    res.status(200).json({
      success: true,
      count: events.length,
      total: totalPastEvents,
      totalPages: Math.ceil(totalPastEvents / parseInt(limit)),
      currentPage: parseInt(page),
      data: events
    });
  } catch (error) {
    console.error('Get past events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching past events',
      error: error.message
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin/SuperAdmin)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Update fields
    const updateFields = [
      'title', 'content', 'category', 'image', 
      'date', 'location', 'isActive', 'priority'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // Save updated event
    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin/SuperAdmin)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// @desc    Toggle event active status
// @route   PATCH /api/events/:id/toggle-status
// @access  Private (Admin/SuperAdmin)
export const toggleEventStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.isActive = !event.isActive;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${event.isActive ? 'activated' : 'deactivated'} successfully`,
      data: event
    });
  } catch (error) {
    console.error('Toggle event status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling event status',
      error: error.message
    });
  }
};

// @desc    Update event priority
// @route   PATCH /api/events/:id/priority
// @access  Private (Admin/SuperAdmin)
export const updateEventPriority = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (priority === undefined || priority < 0 || priority > 10) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be between 0 and 10'
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { priority },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event priority updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update priority error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event priority',
      error: error.message
    });
  }
};

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
export const getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, page = 1 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const events = await Event.find({ 
      category,
      isActive: true 
    })
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalEvents = await Event.countDocuments({ 
      category,
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: events.length,
      total: totalEvents,
      totalPages: Math.ceil(totalEvents / parseInt(limit)),
      currentPage: parseInt(page),
      data: events
    });
  } catch (error) {
    console.error('Get events by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events by category',
      error: error.message
    });
  }
};

// @desc    Get events statistics
// @route   GET /api/events/stats/summary
// @access  Private (Admin/SuperAdmin)
export const getEventStats = async (req, res) => {
  try {
    const now = new Date();

    const [
      totalEvents,
      activeEvents,
      upcomingEvents,
      pastEvents,
      categoryStats
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ isActive: true }),
      Event.countDocuments({ date: { $gte: now }, isActive: true }),
      Event.countDocuments({ date: { $lt: now } }),
      Event.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            upcoming: {
              $sum: {
                $cond: [
                  { $and: [
                    { $gte: ['$date', now] },
                    { $eq: ['$isActive', true] }
                  ]},
                  1,
                  0
                ]
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        activeEvents,
        inactiveEvents: totalEvents - activeEvents,
        upcomingEvents,
        pastEvents,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event statistics',
      error: error.message
    });
  }
};

// @desc    Bulk delete events
// @route   DELETE /api/events/bulk
// @access  Private (SuperAdmin only)
export const bulkDeleteEvents = async (req, res) => {
  try {
    const { eventIds } = req.body;

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of event IDs'
      });
    }

    const result = await Event.deleteMany({ _id: { $in: eventIds } });

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} events`,
      data: {
        deletedCount: result.deletedCount
      }
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting events',
      error: error.message
    });
  }
};