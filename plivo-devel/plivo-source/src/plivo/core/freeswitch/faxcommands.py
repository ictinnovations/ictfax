#/***********************************************************************
#* Copyright © 2012 ICT Innovations, All Rights Reserved                *
#* License: Proprietary                                                 *
#*          Note: Distribution of this code in any form is not allowed. *
#*          For custom license please contact us.                       *
#* Developed By: Nasir Iqbal                                            *
#*             : Tahir Almas                                            *
#*             :  Falak Nawaz                                           *
#* Website : http://www.ictinnovations.com/                             *
#* Contact : support@ictinnovations.com, info@ictinnovations.com        *
#************************************************************************/

class FaxCommands(object):

    def txfax(self, filename, terminators=None, uuid="", lock=True, loops=1):
        """Please refer to http://wiki.freeswitch.org/wiki/Mod_spandsp

        >>> txfax("/tmp/test.tif")

        For Inbound connection, uuid argument is mandatory.
        """
        return self._protocol_sendmsg("txfax", filename, uuid, lock, loops)

    def rxfax(self, filename, terminators=None, uuid="", lock=True, loops=1):
        """Please refer to http://wiki.freeswitch.org/wiki/Mod_spandsp

        >>> rxfax("/tmp/test.tif")

        For Inbound connection, uuid argument is mandatory.
        """
        return self._protocol_sendmsg("rxfax", filename, uuid, lock, loops)

